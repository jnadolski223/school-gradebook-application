const API_BASE_URL = "http://localhost:8080/api/v1";

export interface SchoolApplication {
  id: string;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  schoolName: string;
  schoolStreet: string;
  schoolPostalCode: string;
  schoolCity: string;
  rspoNumber: string;
  description: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface SchoolApplicationShort {
  id: string;
  schoolName: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Pobiera wszystkie wnioski
export async function getAllSchoolApplications(
  status?: "PENDING" | "APPROVED" | "REJECTED",
) {
  const url = new URL(`${API_BASE_URL}/school-applications`);
  if (status) {
    url.searchParams.append("status", status);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch school applications");
  }

  return (await response.json()) as ApiResponse<SchoolApplicationShort[]>;
}

// Pobiera wniosek po ID
export async function getSchoolApplicationById(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-applications/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch school application");
  }

  return (await response.json()) as ApiResponse<SchoolApplication>;
}

// Aktualizuje status wniosku
export async function updateSchoolApplicationStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
) {
  const response = await fetch(`${API_BASE_URL}/school-applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update school application status");
  }

  return (await response.json()) as ApiResponse<SchoolApplication>;
}

// Usuwa wniosek
export async function deleteSchoolApplication(id: string) {
  const response = await fetch(`${API_BASE_URL}/school-applications/${id}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    throw new Error("Failed to delete school application");
  }
}
