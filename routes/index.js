var app = require('../index');
//var express = require('express');
var middleware = require('../middlewares');
var controllers = require('../controllers');

const routerJson=[
    {
        path:"/api",
        children:[
            {
                path: "/user",
                children:[
                    {
                        path:"/users",
                        controller: controllers.api.user.userList
                    },{
                        path:"/users",
                        method:"post",
                        controller: controllers.api.user.userCreate
                    },{
                        path:"/profile",
                        controller: controllers.api.user.info,
                        middleware:[ middleware.shouldLogin ]
                    },{
                        controller: controllers.main.errorHandler
                    }
                ]
            },{
                path: "/survey",
                //middleware:[ middleware.shouldLogin ],
                children:[
                    {
                        path: "/surveys",
                        controller: controllers.api.survey.listOfUser
                    },{
                        path: "/surveys",
                        method: "post",
                        controller: controllers.api.survey.createOfUser
                    },{
                        path: "/:survey_id/:question_id/result",
                        method: "post",
                        controller: controllers.api.result.createResult
                    }
                ]
            }
        ]
    },{
        children:[
            {
                path:"/",
                controller: controllers.main.index
            },{
                path:"/login",
                controller: controllers.main.loginPage,
                middleware: [ app.securityManager.csrfProtection ]
            },{
                path:"/login",
                method:"post",
                controller: controllers.main.login,
                middleware: [ app.securityManager.csrfProtection ]
            },{
                path: "/join",
                controller: controllers.main.registerPage
            },{
                path: "/logout",
                controller: controllers.main.logout
            },{
                path: "/embed/:id",
                controller: controllers.main.embed_survey
            },{
                path: "/account",
                middleware: [middleware.shouldLogin],
                children:[
                    {
                        path: "/my_surveys",
                        controller: controllers.main.my_surveys
                    },{
                        path: "/create_survey",
                        controller: controllers.main.create_survey
                    },{
                        path: "/show_servey/:id",
                        controller: controllers.main.show_survey
                    },{
                        path: "/show_servey/:id/:question_id",
                        controller: controllers.main.show_question
                    },{
                        path:"/show_servey/:id/:question_id/results",
                        controller: controllers.main.show_question_results
                    }
                ]
            },{
                controller: controllers.main.errorHandler
            },{
                path: "*",
                controller: controllers.main.notFound
            }
        ]
    }
];
module.exports.router=require('../system').router.createRouterFromJson(routerJson);