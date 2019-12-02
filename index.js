const fs = require('fs')
const rdf = require('rdf-ext')
const ParserN3 = require('@rdfjs/parser-n3')

function loadDatasetStream (file) {
  return fs.createReadStream(file, { encoding: 'utf8' })
}

async function loadFile (file) {
  const parserN3 = new ParserN3()
  const readStream = loadDatasetStream(file)
  const quadStream = parserN3.import(readStream)
  return rdf.dataset().import(quadStream)
}

loadFile('./SCHEMA_QUDT-DATATYPE-v2.1.ttl')
  .then((dataset) => {
    const graph = rdf.namedNode('http://qudt.org/schema/qudt/')
    dataset = dataset.map(({ subject, predicate, object }) => rdf.quad(subject, predicate, object, graph))
    const x = dataset.toCanonical()
  })
