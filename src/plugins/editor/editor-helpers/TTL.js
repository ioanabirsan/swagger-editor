import YAML from "@kyleshockey/js-yaml"

let rdfKeywords = {"x-rdf-type": "rdf:type", "x-same-as": "owl:sameAs"}
let schemaUrl = "http://schema.org/"
let schemaPrefix = "schema:"

export default class TTL {
  static convertToTurtle (jsonOrYaml) {
    // JSON or YAML String -> JS object
    let jsContent = YAML.safeLoad(jsonOrYaml)
    let ontologyNamespace = jsContent["info"]["title"] || "swagger-schema"
    ontologyNamespace = ontologyNamespace.replace(" ", "_")
    return `${TTL.getOntologyHeader(ontologyNamespace)} \n\n${TTL.jsonToTurtle(jsContent)}`
  }

  static getOntologyHeader (ontologyNamespace) {
    let header =
      `@prefix : <http://www.semanticweb.org/ontologies/${ontologyNamespace}/> .\n` +
      "@prefix dc: <http://purl.org/dc/elements/1.1/> .\n" +
      "@prefix gr: <http://purl.org/goodrelations/v1#> .\n" +
      "@prefix dbo: <http://dbpedia.org/ontology/> .\n" +
      "@prefix dbp: <http://dbpedia.org/property/> .\n" +
      "@prefix dbr: <http://dbpedia.org/resource/> .\n" +
      "@prefix owl: <http://www.w3.org/2002/07/owl#> .\n" +
      "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n" +
      "@prefix xml: <http://www.w3.org/XML/1998/namespace> .\n" +
      "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n" +
      "@prefix muto: <http://purl.org/muto/core#> .\n" +
      "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n" +
      "@prefix schema: <http://schema.org/> .\n" +
      "@prefix sioc: <http://rdfs.org/sioc/ns#> .\n" +
      "@prefix yago: <http://dbpedia.org/class/yago/> .\n" +
      "@prefix owl2xml: <http://www.w3.org/2006/12/owl2-xml#> .\n" +
      `@base <http://www.semanticweb.org/ontologies/${ontologyNamespace}/> .`

    return header
  }

  static jsonToTurtle (swaggerSchema) {
    let rdfTriplesInTurtleSyntax = ""

    let definitions = swaggerSchema["definitions"]
    for (let definitionKey in definitions) {
      let definition = definitions[definitionKey]
      for (let rdfKey in rdfKeywords) {
        if (rdfKey in definition) {
          let rdfKeyword = rdfKeywords[rdfKey]
          let rdfTriple = `:${definitionKey} ${rdfKeyword} <${definition[rdfKey]}> . \n`
          rdfTriplesInTurtleSyntax += rdfTriple
        }
      }

      let properties = definition["properties"]
      for (let propertyKey in properties) {
        let property = properties[propertyKey]
        for (let rdfKey in rdfKeywords) {
          if (rdfKey in property) {
            let rdfKeyword = rdfKeywords[rdfKey]
            let rdfTriple = `:${propertyKey} ${rdfKeyword} <${property[rdfKey]}> . \n`
            let rdfRangeTriple = `:${propertyKey} rdfs:range :${definitionKey} . \n`
            rdfTriplesInTurtleSyntax += rdfTriple
            rdfTriplesInTurtleSyntax += rdfRangeTriple
          }
        }
      }
    }

    return rdfTriplesInTurtleSyntax
  }
}
