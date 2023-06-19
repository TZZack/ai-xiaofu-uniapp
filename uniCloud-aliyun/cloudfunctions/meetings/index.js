'use strict';

const getList = require('./getList/index')

exports.main = async (event, context) => {
	switch(event.type) {
		case 'getList':
			return await getList.main(event, context)
	}
	
	return event
};
