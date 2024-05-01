exports.verifyRole  = (role) => {
    return  [
        (req, res, next) => {
             if(!role){
                 return res.status(400).json({
                     success: false,
                     status: 400,
                     data: [],
                     message: "Undefined role."
                 });
             }

             if(!req.user_detalis){
                 return res.status(401).json({
                     success: false,
                     status: 401,
                     data: [],
                     message: "Unauthorized user."
                 });
             }

             if(req.user_detalis?.role !== role){
                 if(!req.user_detalis){
                     return res.status(400).json({
                         success: false,
                         status: 400,
                         data: [],
                         message: "You are not allowed to access resources."
                     });
                 }
             }

             next();
        }
    ]
}