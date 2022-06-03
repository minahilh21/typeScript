import { Resolver, Mutation, Arg} from "type-graphql";
import { User } from "../../../entity/User";
import { redis } from "../../../redis";
@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(
    @Arg("token") token: string,
  ): Promise<Boolean> {
    
  const userId = await redis.get('confirm_user'+token);
  if(!userId) {
    return false;
  }
  await User.update({id: parseInt(userId, 10)}, {confirmed: true});
  await redis.del('confirm_user'+ token);
  return true;
 }
}