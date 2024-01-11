document.onload = () => console.log( "Le document est prêt" );
let PromesseDocumentPret = new Promise<void>( (resolve) => {
    if (document.readyState === "complete") {
        resolve();
    } else {
        document.onreadystatechange = () => document.readyState === "complete" ? resolve() : null;
    }
});

/***********************************************************************************************************************
 * Utilitaires
 */
export function assertEqual(a: unknown, b: unknown): boolean {
    switch (typeof a) {
        case "object":
            return [...Object.keys(a as Object), ...Object.keys(b as Object)].reduce(
              (acc, k) => acc && assertEqual( (a as any)[k], (b as any)[k]),
              true as boolean
            );
        default:
            return a === b;
    }
}

const template = `
<hr/>
<table>
    <caption></caption>
    <thead>
        <th><h2></h2></th>
    </thead>
    <tbody></tbody>
</table>
`;

function toArgs(L: unknown[]): string {
    return L.map( v => JSON.stringify(v) ).join(", ");
}

export type Assertion<P extends unknown[], V> = {args: P, expectedResult: V, errorExpected?: boolean};
export function LogTests<P extends unknown[], V>(title: string, fct: (...p: P) => V, fName: string, assertions: Assertion<P, V>[]): void {
    PromesseDocumentPret.then( () => LogTestsOK(title, fct, fName, assertions) );
}
export function LogTestsOK<P extends unknown[], V>(title: string, fct: (...p: P) => V, fName: string, assertions: Assertion<P, V>[]): void {
    let section = document.createElement( "section" ),
        nbCorrects = 0,
        exceptionTriggered: boolean;
    section.innerHTML = template;
    section.querySelector( "h2" )!.textContent = title;
    let tbody = section.querySelector( "tbody" );
    for (let {args, expectedResult, errorExpected} of assertions) {
        let tr  = document.createElement( "tr" );
        let res;
        try {
            res = fct.apply(null, args);
            exceptionTriggered = false;
        } catch (err) {
            res = err;
            exceptionTriggered = true;
        }
        let tdI = document.createElement( "td" ); tr.appendChild( tdI );
        tdI.innerHTML  = `<section><section class="root"></section><pre class="actual"></pre><pre class="expected"></pre></section>`;
        const sroot    = tdI.querySelector(".root"    ) as HTMLElement;
        const expected = tdI.querySelector(".expected") as HTMLElement;
        const actual   = tdI.querySelector(".actual"  ) as HTMLElement;
        
        sroot.textContent = `${fName}( ${toArgs(args)} )`; JSON.stringify( args );
        actual  .textContent = `   |    get ${JSON.stringify( res )}`;
        expected.textContent = `   | expect ${JSON.stringify( expectedResult )}`;
        // let tdO = document.createElement( "td" ); tr.appendChild( tdO ); tdO.textContent = JSON.stringify( res );
        // let tdE = document.createElement( "td" ); tr.appendChild( tdE ); tdE.textContent = JSON.stringify( expectedResult );
        if (assertEqual(res, expectedResult) && (typeof errorExpected === "undefined" || exceptionTriggered === errorExpected) ) {
            tr.classList.add( "correct" );
            nbCorrects++;
        } else {
            tr.classList.add( "incorrect" );
        }
        tbody!.appendChild( tr );
    }
    section.querySelector( "caption" )!.textContent = `Recap: ${nbCorrects} / ${assertions.length}`;
    document.body.appendChild( section );
}
