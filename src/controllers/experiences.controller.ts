import {Request, Response} from "express"
import Experience from "../models/Experience";
import response from "./response";


export const getAllExperiences = async (req: Request, res: Response) => {  
    try {
      const EXPERIENCES = await Experience.findAll()
  
      return response(200, `success get all experiences`, EXPERIENCES, res)
    } catch (error) {
      res.status(500).json({ error: error });
    }
};

export const getExperiencesById = async (req: Request, res: Response) => {  
    const id = req.params.id
    try {
      const EXPERIENCE = await Experience.findByPk(id)
  
      if(!EXPERIENCE) return res.status(404).json({message: "experience not found"})
  
      return response(200, `success get experience by id`, EXPERIENCE, res)
      
    } catch (error) {
      res.status(500).json({ error });
    }
};

export const updateExperienceById = async (req: Request, res: Response) => {  
  const id = req.params.id
  const experienceData = req.body
  try {
    const EXPERIENCE = await Experience.findByPk(id)

    if(!EXPERIENCE) return res.status(404).json({message: "experience not found"})

    await EXPERIENCE.update(experienceData)

    return response(200, `success update experience by id`, EXPERIENCE, res)
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteExperienceById = async (req: Request, res: Response) => {  
  const id = req.params.id
  try {
    const EXPERIENCE = await Experience.findByPk(id)

    if(!EXPERIENCE) return res.status(404).json({message: "experience not found"})

    await EXPERIENCE.destroy()

    return response(200, `success delete experience by id`, [], res)
    
  } catch (error) {
    return res.status(500).json({ error });
  }
};