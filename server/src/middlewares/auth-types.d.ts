import { Request } from 'express'
import { user } from '../db/db-types'

export default interface authReq extends Request {
  user: user
}
