import * as ts from "typescript";
import * as fs from "fs";
import * as mkdirp from 'mkdirp';
import * as _ from 'lodash';
import * as rimraf from 'rimraf';

interface DocEntry {
  name?: string;
  fileName?: string;
  extends?: string;
  documentation?: string;
  type?: string;
  required?: boolean;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  properties?: DocEntry[];
  methods?: DocEntry[];
  returnType?: string;
}

function generateDocumentation(
  options: ts.CompilerOptions
): void {

  let name = 'three'

  let program = ts.createProgram([
    `node_modules/@types/${name}/index.d.ts`
  ], options);

  let checker = program.getTypeChecker();
  let output: DocEntry[] = [];

  for (const sourceFile of program.getSourceFiles()) {
    ts.forEachChild(sourceFile, visit);
  }

  console.log(JSON.stringify(output, null, 2))

  const path = 'descriptors/geometries'
  const source = fs.readFileSync('template.js.erb')
  const template = _.template(source.toString())

  // rimraf('descriptors', () => {
    mkdirp(path, function(err) {
      if (err) console.error(err)
      else {
        const {name, constructors} = output[0]
        const {parameters} = constructors[0]
        const camelName = _.camelCase(name)
        fs.writeFile(`${path}/${camelName}.ts`, template({name, camelName, parameters}), console.log)
      }
    })
  // })

  function visit(node: ts.Node) {

    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      let classDeclaration = <ts.ClassDeclaration>node;
      let symbol = checker.getSymbolAtLocation(classDeclaration.name);
      if (symbol.getName() === "BoxGeometry") {
        output.push(serializeClass(symbol));
      }
    }
  }

  function serializeSymbol(symbol: ts.Symbol): DocEntry {
    const name = symbol.getName()
    const _symbol: DocEntry = {
      name,
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
      )
    };

    symbol.getDeclarations().forEach(declaration => {
      if (ts.isParameter(declaration)) {
        _symbol.required = !checker.isOptionalParameter(declaration)
      }
    })

    const documentation = ts.displayPartsToString(
      symbol.getDocumentationComment()
    );
    if (documentation && documentation !== "") _symbol.documentation = documentation;
    return _symbol;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    const _signature: DocEntry = {};

    const documentation = ts.displayPartsToString(
      signature.getDocumentationComment()
    );
    if (documentation && documentation !== "")
      _signature.documentation = documentation;

    const parameters = signature.parameters.map(serializeSymbol);
    if (parameters && parameters.length > 0) _signature.parameters = parameters;

    const returnType = checker.typeToString(signature.getReturnType());
    if (returnType && returnType !== "") _signature.returnType = returnType;

    return _signature;
  }

  function serializeClass(symbol: ts.Symbol):DocEntry {
    let details = serializeSymbol(symbol);
    if (details) {
      if (symbol.members) {
        let constructorType = checker.getTypeOfSymbolAtLocation(
          symbol,
          symbol.valueDeclaration
        );
        details.constructors = constructorType
          .getConstructSignatures()
          .map(serializeSignature);

        return details
      }
    }
  }
}

generateDocumentation({
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});
