const AccessControl = require('accesscontrol');


let grantsObject = {
    admin: {
    /* resource is profile */    
    profile: { 
        //these are the actions
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        },
    articles:{
            'read:any': ['*'],
        },
    article : {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']

    }    
    },
    user: {
    profile: {
            'create:own': ['*'],
            'read:own': ['*' , '!password' , '!date' , '!_id'] ,
            'update:own': ['*' , '!password' , '!date' , '!_id'],
            'delete:own': ['*']
        }
    }
};
const roles = new AccessControl(grantsObject);
module.exports={roles}
