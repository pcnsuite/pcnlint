var chai		= require('chai'),
	expect		= chai.expect,
	docData		= process.env.pcnlint_testcase,
	doc;

// Verify we have nothing after the decimal on a given value
function noDecimals(v) {
	return v % 1 === 0.0;
}

// Verify that a given property is one of a list of strings
function stringMatch(stringValues) {
	return function(testValue) {
		for (var i = stringValues.length - 1; i >= 0; i--) {
			if (stringValues[i] === testValue) {
				return true;
			}
		}
		return false;
	};
}

// Verify that a given domain id is one of the domains in our document
function domainExists(domains) {
	// Verify the domain assigned exists
	return function(domainId) {
		for (var i = domains.length - 1; i >= 0; i--) {
			if (domainId === domains[i].id) {
				return true;
			}
		}
		return false;
	};
}

// Verify that a given step id is one of the steps in our document
function stepExists(steps) {
	return function(stepId) {
		// Verify the step exists
		for (var i = steps.length - 1; i >= 0; i--) {
			if (stepId === steps[i].id) {
				return true;
			}
		}
		return false;
	};
}

// Predecessor validation
function predecessorTest(pred) {
	return function() {
		it('should have a property id that is a string and is a real step id', function() {
			expect(pred).to.have.property('id')
			.that.is.a('string')
			.and.to.satisfy(stepExists(doc.steps));
		});

		it('should have a property type that is a string and is either normal_relationship or loose_temporal_relationship', function() {
			expect(pred).to.have.property('type')
			.that.is.a('string')
			.and.to.satisfy(stringMatch(['normal_relationship', 'loose_temporal_relationship']));
		});

		it('can have an optional property title that is a string', function() {
			if (pred.title) {
				expect(pred).to.have.property('title')
				.that.is.a('string');
			}
		});
	};
}

// Step problem validation
function stepProblemTest(problem) {
	return function() {
		it('should be an object', function() {
			expect(problem).to.be.an('object');
		});

		it('should have property type that is a string and is one of inconvenient, confusing, difficult, or likely_to_fail', function() {
			expect(problem).to.have.property('type')
			.that.is.a('string')
			.and.to.satisfy(stringMatch(['inconvenient', 'confusing', 'difficult', 'likely_to_fail']));
		});

		it('should have property description that is a string', function() {
			expect(problem).to.have.property('description')
			.that.is.a('string');
		});
	};
}

// Step validation
function stepTest(step) {
	return function() {
		it('should be an object', function() {
			expect(step).to.be.an('object');
		});

		it('should have property id that is a string', function() {
			expect(step).to.have.property('id')
			.that.is.a('string');
		});

		it('should have a property title that is a string', function() {
			expect(step).to.have.property('title')
			.that.is.a('string');
		});

		it('should have a property type that is a string and one of process, decision, divergent_process, or wait', function() {
			expect(step).to.have.property('type')
			.that.is.a('string')
			.and.to.satisfy(stringMatch(['process', 'decision', 'divergent_process', 'wait']));
		});

		it('can have an optional property emphasized that is a boolean', function() {
			if (step.emphasized) {
				expect(step).to.have.property('emphasized')
				.that.is.a('boolean');
			}
		});

		it('can have an optional property value_specific that is a number and has no decimals', function() {
			if (step.value_specific) {
				expect(step).to.have.property('value_specific')
				.that.is.a('Number')
				.and.to.satisfy(noDecimals);
			}
		});

		it('can have an optional property value_generic that is a number and has no decimals', function() {
			if (step.value_generic) {
				expect(step).to.have.property('value_generic')
				.that.is.a('Number')
				.and.to.satisfy(noDecimals);
			}
		});

		if (step.predecessors) {
			it('can have an optional property predecessors that is an array', function() {
				expect(step).to.have.property('predecessors')
				.that.is.an('array');
			});

			for (var p = step.predecessors.length - 1; p >= 0; p--) {
				describe('Predecessor at index ' + p, predecessorTest(step.predecessors[p]));
			}
		}

		it('should have property domain that is an object', function() {
			expect(step).to.have.property('domain')
			.that.is.an('object');
		});

		describe("Step id " + step.id + " domain", function() {
			var domain = step.domain;

			it('should have property id that is a string and is an existing domain', function() {
				expect(domain).to.have.property('id')
				.that.is.a('string')
				.and.to.satisfy(domainExists(doc.domains));
			});

			it('should have property region that is an object', function() {
				expect(domain).to.have.property('region')
				.that.is.an('object');
			});

			describe("Region", function() {
				it('should have property type that is a string and one of independent, surrogate, direct_leading, or direct_shared', function() {
					expect(domain.region).to.have.property('type')
					.that.is.a('string')
					.and.to.satisfy(stringMatch(['independent', 'surrogate', 'direct_leading', 'direct_shared']));
				});

				if (domain.region.type !== 'independent') {
					it('when non-independent should have property with_domain that is a string that is a valid domain', function() {
						expect(domain.region).to.have.property('with_domain')
						.that.is.a('string')
						.and.to.satisfy(domainExists);
					});
				}
			});
		});

		if (step.problems) {
			it('can have optional property problems that is an array', function() {
				expect(step).to.have.property('problems')
				.that.is.an('array');
			});

			for (var pr = 0; pr < step.problems.length; pr++) {
				describe('Step problem at index ' + pr, stepProblemTest(step.problems[pr]));
			}
		}
	};
}

// Start of tests

// Validate PCN Document as a whole
describe('PCN Document', function() {
	it('must be valid JSON', function() {
		expect(function() { JSON.parse(docData); }).to.not.throw(Error);
	});

	doc = JSON.parse(docData);

	// Metadata must be object
	it('must have valid metadata', function() {
		expect(doc).to.have.property('metadata')
		.that.is.an('object', 'The metadata property must be an object');
	});

	it('should have domains property that is an array', function() {
		// Domains is array
		expect(doc).to.have.property('domains')
		.that.is.an('array', 'The domains property must be an array');
	});

	
	it('should have steps property that is an array', function() {
		// Steps is array of at least 2 objects
		expect(doc).to.have.property('steps')
		.that.is.an('array', 'The steps property must be an array');
	});

	describe('Domains', function() {
		// Domain Validation
		function domainTest() {
			var domain = doc.domains[d];
			/**
			1. id is string
			2. id is unique
			3. title is string
			4. subtitle is string
			**/
			it('should be an object', function() {
				expect(domain).to.be.an('object');
			});

			it('should have property id that is a string', function() {
				expect(domain).to.have.property('id')
				.that.is.a('string');
			});

			it('should have property title that is a string', function() {
				expect(domain).to.have.property('title')
				.that.is.a('string');
			});

			it('should have property subtitle that is a string', function() {
				expect(domain).to.have.property('subtitle')
				.that.is.a('string', 'Domain ' + d + ' title must be a string');
			});
		}
		for (var d = 0; d < doc.domains.length; d++) {
			describe('Domain at index ' + d, domainTest);
		}
	});

	describe('Steps', function() {
		for (var s = 0; s < doc.steps.length; s++) {
			describe('Step at index ' + s, stepTest(doc.steps[s]));
		}
	});
});