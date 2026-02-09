export type SchoolApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  status: SchoolApplicationStatus;
}

export interface SchoolApplicationShort {
  id: string;
  schoolName: string;
  createdAt: string;
  status: SchoolApplicationStatus;
}

const API_URL = "http://localhost:8080/api/v1";

export async function createSchoolApplication(data: {
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  schoolName: string;
  schoolStreet: string;
  schoolPostalCode: string;
  schoolCity: string;
  rspoNumber: string;
  description: string;
}) {
  const res = await fetch(`${API_URL}/school-applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Nie udało się utworzyć wniosku");
  }

  return res.json();
}

export async function getSchoolApplications(
  status?: "PENDING" | "APPROVED" | "REJECTED",
): Promise<SchoolApplicationShort[]> {
  const url = status
    ? `${API_URL}/school-applications?status=${status}`
    : `${API_URL}/school-applications`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Nie udało się pobrać wniosków");
  }

  const json = await res.json();
  return json.data;
}

export async function getSchoolApplicationById(
  id: string,
): Promise<SchoolApplication> {
  const res = await fetch(`${API_URL}/school-applications/${id}`);

  if (!res.ok) {
    throw new Error("Nie udało się pobrać wniosku");
  }

  const json = await res.json();
  return json.data;
}

export async function updateSchoolApplicationStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED",
): Promise<SchoolApplication> {
  const res = await fetch(`${API_URL}/school-applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Nie udało się zmienić statusu");
  }

  const json = await res.json();
  return json.data;
}

export async function deleteSchoolApplication(id: string) {
  const res = await fetch(`${API_URL}/school-applications/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Nie udało się usunąć wniosku");
  }
}
