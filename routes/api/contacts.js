import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import { validateBody } from "../../decorators/index.js";

import {
  isEmptyBody,
  isValidId,
  authenticate,
} from "../../middlewares/index.js";

import contactsSchemas from "../../schemas/contacts-schemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post(
  "/",
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.add
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.updateById
);
contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(contactsSchemas.contactUpdateVaforiteSchema),
  contactsController.updateStatusContact
);

contactsRouter.delete("/:contactId", isValidId, contactsController.deleteById);

export default contactsRouter;
