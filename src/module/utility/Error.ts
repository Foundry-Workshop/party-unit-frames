import { MODULE_NAME } from "../settings";


export default class WorkshopError extends Error {
  constructor(error) {
    error = `${MODULE_NAME} | ${error}`;
    super(error);
  }
}
