import { auth } from "@/auth";
import { getUserById } from "@/lib/actions/user.actions";

// * Components
import PaymentMethodForm from "./payment-method-form";
import { PAYMENT_METHOD } from "@/lib/constants";

export const metadata = {
  title: "Payment Method"
};

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No user ID");
  }

  const user = await getUserById(userId);

  return (
    <PaymentMethodForm
      preferredPaymentMethod={(user.paymentMethod as PAYMENT_METHOD) || null}
    />
  );
}
