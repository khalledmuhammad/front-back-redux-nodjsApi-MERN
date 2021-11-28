const {roles} = require("../config/rolesConfig")

exports.grantAccess = function(action , resource){
    return async (req,res,next)=>{
        try {

            const permission = roles.can(req.user.role)[action](resource)
            //can (admin)[createown] (profile)
            if(!permission.granted){
                return res.status(401).json({ error : "not autherized" })


            }
            res.locals.permission = permission ;
            next()
            
        } catch (error) {
            next(error)
            
        }
    }
}