import type { DomainResponse } from "@/lib/api/types";
import type { VerificationFile, VerificationMethod, VerificationRecord } from "@/types";

export function verificationToProps(d: DomainResponse): {
  method: VerificationMethod;
  record?: VerificationRecord;
  file?: VerificationFile;
} {
  const v = d.verification;
  if (v.method === "file") return { method: "file", file: { path: v.location, content: v.value } };
  return { method: "dns", record: { name: v.location, value: v.value } };
}
