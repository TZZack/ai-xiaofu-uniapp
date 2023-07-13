// 提供给http访问，会议相关的curd
'use strict';

const addMeetings = require('./addMeetings/index')
const deleteMeeting = require('./deleteMeeting/index')
const updateMeeting = require('./updateMeeting/index')
const getMeetings = require('./getMeetings/index')
const deleteAll = require('./deleteAll/index')
const getMeetingById = require('./getMeetingById/index')
const getDeletedList = require('./getDeletedList/index')

const db = uniCloud.database()
exports.main = async (event, context) => {
	let type
	let data
	try{
		const body = JSON.parse(event.body)
		type = body.type
		data = body.data
	}catch(e){
		data = event.data
		type = event.type
	}
	switch(type) {
		case 'addMeetings':
			return await addMeetings.main(data, context)
		case 'deleteMeeting':
			return await deleteMeeting.main(data, context)
		case 'updateMeeting':
			return await updateMeeting.main(data, context)
		case 'getMeetings':
			return await getMeetings.main()
		case 'getMeetingById':
			return await getMeetingById.main(data, context)
		case 'deleteAll':
			return await deleteAll.main()
		case 'getDeletedList':
			return await getDeletedList.main()
	}
	
	return event
};
