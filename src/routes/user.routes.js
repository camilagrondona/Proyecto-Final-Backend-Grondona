import { Router } from "express"
import userController from "../controllers/user.controller.js"
import { upload } from "../utils/uploadFiles.js"
import { authorization, passportCall } from "../middlewares/passport.middleware.js"

const router = Router()

router.post("/email/reset-password", userController.sendEmailResetPassword)
router.post("/reset-password", userController.resetPassword)
router.get("/premium/:uid", userController.changeUserRole)

// Para subir un solo archivo

// router.post("/upload", upload.fields("file"), async (req, res) => {
//     res.send(req.file)
// }) 


// Para subir varios archivos

router.post(
    "/:uid/documents",
    passportCall("jwt"),
    authorization(["user", "premium"]),
    upload.fields([
        { name: "profile", maxCount: 1 },
        { name: "productImg", maxCount: 1 },
        { name: "document", maxCount: 3 },
    ]),
    userController.addDocuments
)

// Eliminar usuarios inactivos
router.delete(
    "/delete-inactive-users",
    passportCall("jwt"), 
    authorization(["admin"]), // Solo administradores pueden acceder
    userController.deleteInactiveUsers // Controlador para eliminar usuarios inactivos
)

// Obtener todos los usuarios
router.get("/get-all-users", passportCall("jwt"), authorization(["admin"]), userController.getAllUsers)

export default router