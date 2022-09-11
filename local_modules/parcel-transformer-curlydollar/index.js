const { Transformer } = require('@parcel/plugin');

const transformer = new Transformer({
  async transform({asset}) {
    // Retrieve the asset's source code and source map.
    let source = await asset.getCode();
    let sourceMap = await asset.getMap();

    // Run it through some compiler, and set the results 
    // on the asset.

	let code = source;
	let map = sourceMap;
	
	asset.type = 'html';
    asset.setCode(code);
    asset.setMap(map);

    // Return the asset
    return [asset];
  }
});

module.exports = transformer;