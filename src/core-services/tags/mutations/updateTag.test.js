/* eslint-disable id-length */
import mockContext from "@reactioncommerce/api-utils/tests/mockContext.js";
import ReactionError from "@reactioncommerce/reaction-error";
import updateTag from "./updateTag.js";

const testShopId = "1234";
const testTagId = "5678";

beforeEach(() => {
  jest.resetAllMocks();
});

test("calls mutations.updateTag and returns the UpdateTagPayload on success", async () => {
  mockContext.validatePermissions.mockReturnValueOnce(Promise.resolve(null));
  mockContext.collections.Tags.updateOne.mockReturnValueOnce({ result: { n: 1 } });
  mockContext.collections.Tags.findOne.mockReturnValueOnce({
    _id: "5678",
    shopId: "1234",
    isVisible: true,
    name: "shirts",
    displayTitle: "Shirts"
  });

  const input = {
    shopId: testShopId,
    tagId: testTagId,
    isVisible: true,
    name: "shirts",
    displayTitle: "Shirts"
  };
  const result = await updateTag(mockContext, input);

  expect(result).toBeDefined();
  expect(mockContext.collections.Tags.updateOne).toHaveBeenCalled();
});

test("calls mutations.updateTag and throws for non admins", async () => {
  mockContext.validatePermissions.mockImplementation(() => {
    throw new ReactionError("access-denied", "Access Denied");
  });
  mockContext.collections.Tags.updateOne.mockReturnValueOnce({ result: { n: 1 } });

  const result = updateTag(mockContext, {});
  expect(result).rejects.toThrowErrorMatchingSnapshot();
  expect(mockContext.collections.Tags.updateOne).not.toHaveBeenCalled();
});
