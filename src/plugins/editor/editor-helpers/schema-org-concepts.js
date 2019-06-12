/* eslint-disable quotes */
import schemaOrg from "./schema-org"

export default class SchemaOrgExtractor {
  static getClasses () {
    let concepts = schemaOrg["@graph"]
    return concepts.filter(concept => concept["@type"] === "rdfs:Class").map(concept => concept["@id"])
  }

  static getProperties () {
    let concepts = schemaOrg["@graph"]
    return concepts.filter(concept => concept["@type"] === "rdf:Property").map(concept => concept["@id"])
  }
}
