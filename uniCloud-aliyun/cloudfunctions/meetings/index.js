'use strict';

const getList = require('./getList/index')
const updateDeleteStatus = require('./updateDeleteStatus/index')

exports.main = async (event, context) => {
	switch(event.type) {
		case 'getList':
			return await getList.main(event, context)
		case 'updateDeleteStatus':
			return await updateDeleteStatus.main(event, context)
	}
	
	return event
};
