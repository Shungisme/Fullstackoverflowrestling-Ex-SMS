import { BASE_URL, Language } from "@/src/constants/constants";
import { Address, AddressType } from "@/src/types";
import { toQueryString } from "@/src/utils/helper";

export const AddressService = {
  async updateAddress(
    addressId: string,
    address: Address,
    type: string,
  ): Promise<void> {
    const queryString = new URLSearchParams({ type }).toString();
    const response = await fetch(
      `${BASE_URL}/addresses/${addressId}?${queryString}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update address");
    }
  },

  async addAddress(
    studentId: string,
    address: Address,
    type: string,
  ): Promise<void> {
    const queryString = toQueryString({ type, studentId });
    const response = await fetch(
      `${BASE_URL}/addresses/${studentId}?${queryString}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to add address");
    }
  },
};
