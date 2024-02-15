const status = require("http-status");
const { MESSAGES } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { APIresponse } = require("../utils/APIresponse");
const APIError = require("../utils/APIError");
const dbUtils = require("../utils/database");
const { uploadFile } = require("../utils/fileUpload");
const path = require("path");
const { pagination } = require("../utils/pagination");

const ip = require("ip");
const { Op } = require("sequelize");
const { User, Project, ProjectMember } = require("../models");
const ProjectImage = require("../models/projectImages");


const addProject = catchAsync(async (req, res, next) => {
    const { title, descriptions, startDate, estimationTime, clientId } = req.body;
    const ipv4Address = ip.address();
    let project = await Project.create({
        title,
        descriptions,
        startDate,
        estimationTime,
        userId: clientId,
    });
    if (req.files !== null) {
        const files = Array.isArray(req.files.avatar) ? req.files.avatar : [req.files.avatar];
        if (files !== undefined) {
            const savePath = path.join(__dirname, "./../uploads/")
            for (const file of files) {
                const fileName = file.name
                console.log()
                await uploadFile(file, savePath, file.name)
                console.log("===========>", project.id)
                const filepath = `http://${ipv4Address}:4000/uploads/` + fileName
                const ProjectImages = await ProjectImage.create({
                    imageUrl: filepath ?? null,
                    projectId: project.id
                })
            }
        }
    }
    const projects = await Project.findOne({
        include: [
            {
                model: ProjectImage
            }],
        where: {
            id: project.id
        }
    })
    project.id = null

    return APIresponse(res, MESSAGES.USER_CREATED, {
        projects,
    });
});



// const asigningProject = catchAsync(async (req, res, next) => {
//     const { clientId, venderId, manegerId, workerId, projectId } = req.body
//     const projectAsigned = await ProjectMember.create({
//         venderId,
//         clientId,
//         manegerId,
//         workerId,
//         projectId
//     });
//     return APIresponse(res, MESSAGES.USER_CREATED, {
//         projectAsigned,
//     });

// })

const asigningProject = catchAsync(async (req, res, next) => {
    const { clientId, vendorId, managerId, workerId, projectId } = req.body;

    // Create an array of objects for each user type with the corresponding user IDs
    const users = [
        { userType: 'Client', userId: clientId },
        { userType: 'Vendor', userId: vendorId },
        { userType: 'Manager', userId: managerId },
        { userType: 'Worker', userId: workerId }
    ];

    // Map over the users array and create a ProjectMember for each user
    const projectAssigned = await Promise.all(
        users.map(async ({ userType, userId }) => {
            return await ProjectMember.create({
                projectId,
                userId: clientId,
                userType
            });
        })
    );

    return APIresponse(res, MESSAGES.USER_CREATED, {
        projectAssigned,
    });
});

module.exports = {
    addProject,
    asigningProject
}