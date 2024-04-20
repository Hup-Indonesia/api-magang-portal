import {Request, Response} from "express"
import response from "./response";
import Education from "../models/Education";


export const getAllEducations = async (req: Request, res: Response) => {  
    try {
      const EDUCATIONS = await Education.findAll()
  
      return response(200, `success get all educations`, EDUCATIONS, res)
    } catch (error) {
      res.status(500).json({ error: error });
    }
};

export const getEducationById = async (req: Request, res: Response) => {  
    const educationId = req.params.id
    try {
      const EDUCATION = await Education.findByPk(educationId)
  
      if(!EDUCATION) return res.status(404).json({message: "education not found"})
  
      return response(200, `success get education by id`, EDUCATION, res)
      
    } catch (error) {
      res.status(500).json({ error });
    }
};

export const updateEducationById = async (req: Request, res: Response) => {  
    const id = req.params.id
    const educationData = req.body
    try {
      const EDUCATION = await Education.findByPk(id)
  
      if(!EDUCATION) return res.status(404).json({message: "education not found"})
  
      await EDUCATION.update(educationData)
  
      return response(200, `success update education by id`, EDUCATION, res)
    } catch (error) {
      return res.status(500).json({ error });
    }
};
  
export const deleteEducationById = async (req: Request, res: Response) => {  
    const id = req.params.id
    try {
      const EDUCATION = await Education.findByPk(id)
  
      if(!EDUCATION) return res.status(404).json({message: "education not found"})
  
      await EDUCATION.destroy()
  
      return response(200, `success delete education by id`, [], res)
      
    } catch (error) {
      return res.status(500).json({ error });
    }
};