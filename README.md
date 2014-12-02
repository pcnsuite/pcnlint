# PCN Linter

> Because PCN data can be rife with errors

PCN Linter is a validation tool that adheres to [PCN Spec 1.0](https://github.com/mjswensen/pcn-spec).

## Usage

    npm install -g pcnlint

Then you can...

    pcnlint pizza-parlor.json

Or...

    cat pizza-parlor.json | pcnlint

When using file names as parameters, you can chain together multiple files to lint them all together.

## Todo

- [x] Get the PCN-Spec example to pass
- [x] Support input from `stdin`
- [ ] Get other PCN examples to pass
- [ ] Prettify error output
- [ ] Support recursive file input


## License
This software is licensed under the MIT license. Copyright 2014 Brent Anderson.

