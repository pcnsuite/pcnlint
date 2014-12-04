# PCN Linter

> Because PCN data can be rife with errors

PCN Linter is a validation tool that adheres to [PCN Spec](https://github.com/pcnsuite/pcn-spec).

## Usage

    npm install -g pcnlint

Then you can...

    pcnlint pizza-parlor.json

Or...

    cat pizza-parlor.json | pcnlint

When using file names as parameters, you can chain together multiple files to lint them all together.

Or...

    var pcnlint = require('pcnlint');
    pcnlint.testDocument(jsonDoc, {reporter: 'json'});

## Options

Currently pcnlint will take a list of files to lint (or it will read from stdin if no files are provided).

pcnlint also accepts mocha's test reporter parameters, `--reporter` and `-R` to customize test result output.
This can be very useful when using pcnlint inside an application, as output can be direct JSON:

    cat pizza-parlor.json | pcnlint --reporter json

All other mocha reporters are available.

## Todo

- [x] Get the PCN-Spec example to pass
- [x] Support input from `stdin`
- [x] Get other PCN examples to pass
- [x] Prettify error output
- [x] Support mocha reporters as an option
- [ ] Support recursive file input


## License
This software is licensed under the MIT license. Copyright 2014 Brent Anderson.

