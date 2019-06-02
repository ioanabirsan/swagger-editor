import YAML from "@kyleshockey/js-yaml"

let rdfKeywords = {"x-rdf-type": "rdf:type", "x-same-as": "owl:sameAs"}

export default class TTL {
  static convertToTurtle (jsonOrYaml, ontologyNamespace) {
    return `${TTL.getOntologyHeader(ontologyNamespace)} \n\n ${TTL.jsonOrYamlToTurtle(jsonOrYaml)}`
  }

  static getOntologyHeader (ontologyNamespace) {
    // TODO
    // prefix for rdf, owl, etc, ontology namespace
    return ontologyNamespace
  }

  static jsonOrYamlToTurtle (jsonOrYaml) {
    // JSON or YAML String -> JS object
    let jsContent = YAML.safeLoad(jsonOrYaml)

    let rdfTriplesInTurtleSyntax = ""

    for (let definitionKey in jsContent["definitions"]) {
      let definition = jsContent["definitions"][definitionKey]
      for (let rdfKey in rdfKeywords) {
        if (rdfKey in definition) {
          let rdfKeyword = rdfKeywords[rdfKey]
          let rdfTriple = `${definitionKey} ${rdfKeyword} ${definition[rdfKey]} . \n`
          rdfTriplesInTurtleSyntax += rdfTriple
        }
      }
    }

    return rdfTriplesInTurtleSyntax
  }
}
