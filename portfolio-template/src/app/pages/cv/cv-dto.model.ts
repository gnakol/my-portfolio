import { Experience } from "../../components/experiences-package/experience.model";
import { Hobbies } from "../../components/hobbies-package/hobbies.model";
import { Language } from "../../components/language-package/language.model";
import { Skill } from "../../components/skill-package/skill.model";
import { Training } from "../../components/training-package/training.model";

export interface CvDTO {

  name: string;

  email: string;

  linkedinUrl: string;

  githubUrl: string;

  address: string;

  experiences: Experience[];

  trainings: Training[];

  skills: Skill[];

  hobbies: Hobbies[];

  languages: Language[];
}