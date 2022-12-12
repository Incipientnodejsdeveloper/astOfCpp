import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { CPP14Lexer } from './Cpp/CPP14Lexer';
import {  CPP14Parser, FunctionDefinitionContext, IterationStatementContext, StatementContext} from './Cpp/CPP14Parser';

const program = `#include <iostream>
using namespace std;

int main(){
    int n, i;
    float num[100], sum=0.0, average;

    cout << "Enter the numbers of data: ";
    cin >> n;

    while (n > 100 || n <= 0)
    {
        cout << "Error! number should in range of (1 to 100)." << endl;
        cout << "Enter the number again: ";
        cin >> n;
    }

    for(i = 0; i < n; ++i)
    {
        cout << i + 1 << ". Enter number: ";
        cin >> num[i];
        sum += num[i];
    }

    average = sum / n;
    cout << "Average = " << average;

    return 0;
}`

// Create the lexer and parser
let inputStream = CharStreams.fromString(program);
let lexer = new CPP14Lexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new CPP14Parser(tokenStream);

// Parse the input, where `program` is whatever entry point you defined
let tree = parser.translationUnit();


import { CPP14ParserListener } from './Cpp/CPP14ParserListener';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'


let id = 0;
let parse: any = [];

class EnterFunctionListener implements CPP14ParserListener {

    GenParse = (cxt: any, type: string) => {
        id = id + 1
        let startLine: any = cxt.start?.line;
        let stopLine: any = cxt._stop?.line;
        let start: number = cxt._start?.startIndex;
        let stop: any = cxt._stop?.stopIndex;
        return {
            id: id,
            line: [startLine, stopLine],
            text: program.slice(start, stop + 1),
            type,
        };
    }

  enterStatement(ctx: StatementContext) : any {
    parse.push(this.GenParse(ctx, 'normal statement'))
  };

  enterIterationStatement(ctx: IterationStatementContext): any {
    parse.push(this.GenParse(ctx, 'Iteration statement'))
  };

   enterFunctionDefinition(ctx: FunctionDefinitionContext) {
    parse.push(this.GenParse(ctx, 'function'))
  }

  // other enterX functions...
}

// Create the listener
const listener: CPP14ParserListener = new EnterFunctionListener();
// Use the entry point for listeners
ParseTreeWalker.DEFAULT.walk(listener, tree)

console.dir({parse},{depth:null})


