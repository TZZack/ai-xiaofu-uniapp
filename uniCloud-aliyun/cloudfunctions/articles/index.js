'use strict';

const getList = require('./getList/index')
const getTypes = require('./getTypes/index')

exports.main = async (event, context) => {
	switch(event.type) {
		case 'getList':
			return await getList.main(event, context)
		case 'getTypes':
			return await getTypes.main(event, context)
	}
};
