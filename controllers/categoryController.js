const Category = require("../models/category");
const responseHandler = require("../handlers/responseHandler");
const successMessages = require("../config/successMessages.json");
const errorMessages = require("../config/errorMessages.json");
const filterKeys = require("../config/filterKeys");
const filterHandler = require("../handlers/filterHandler");
const _ = require("lodash");

async function createCategory(req, res) {
    try {
        const { name, description } = req.body;

        if (!name) {
            return responseHandler.sendResponse(
                res,
                errorMessages.nameRequired,
                null,
                false
            );
        }

        let category = await Category.create({
            name,
            description,
        });
        category = filterHandler.keepKeys(
            category.toJSON(),
            filterKeys.category
        );
        responseHandler.sendResponse(res, successMessages.categoryCreated, {
            category,
        });
    } catch (error) {
        console.error("Error creating category:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.creationError,
            null,
            false
        );
    }
}

async function getAllCategories(req, res) {
    try {
        // Fetch all categories from the database
        const categories = await Category.findAll();

        // Optionally filter or transform the result if needed
        const filteredCategories = categories.map((category) =>
            filterHandler.keepKeys(category.toJSON(), filterKeys.category)
        );

        // Send the response with the list of categories
        responseHandler.sendResponse(res, successMessages.categoriesFetched, {
            categories: filteredCategories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error.message, error);
        responseHandler.sendResponse(
            res,
            errorMessages.categoryFetchError,
            null,
            false
        );
    }
}

async function editCategory(req, res) {
    try {
        const categoryDetails = req.body;
        const uniqueId = req.query.uniqueId;
        if (_.isEmpty(categoryDetails)) {
            return responseHandler.sendResponse(
                res,
                errorMessages.allFieldsRequired,
                null,
                false
            );
        }
        await Category.update(categoryDetails, { where: { uniqueId } });
        responseHandler.sendResponse(res, successMessages.categoriesUpdated);
    } catch (error) {
        console.error("Error editing categories:", error.message);
        responseHandler.sendResponse(
            res,
            errorMessages.editingCategoryError,
            null,
            false
        );
    }
}



module.exports = {
    createCategory,
    getAllCategories,
    editCategory
};