POST `/api/v1/school-classes` - tworzy nową klasę szkolną i zwraca jej dane.
Zwracany status w przypadku powodzenia: `201`
`Body` wymagane do zapytania:

```json
{
	"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
	"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
	"name": "7C"
}
```

Format zwracanych danych:

```json
{
	"status": 201,
	"message": "School class created successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "7C"
	}
}
```

---

GET `/api/v1/school-classes` - pobiera listę wszystkich klas szkolnych w bazie danych.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All school classes fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"name": "7C"
		},
		...
	]
}
```

---

GET `/api/v1/school-classes?schoolId=X` - pobiera listę wszystkich klas w danej szkole.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "All classes in school with ID X fetched successfully",
	"data": [
		{
			"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"schoolId": "X",
			"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
			"name": "7C"
		},
		...
	]
}
```

---

GET `/api/v1/school-classes/:id` - zwraca dane klasy szkolnej o podanym `id`.
Zwracany status w przypadku powodzenia: `200`
Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School class fetched successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "7C"
	}
}
```

---

PATCH `/api/v1/school-classes/:id` - aktualizuje klasę szkolną o podanym `id` i zwraca zaktualizowaną klasę szkolną.
Zwracany status w przypadku powodzenia: `200`
`Body` wymagane do zapytania:

```json
{
	"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
	"name": "4D"
}
```

Format zwracanych danych:

```json
{
	"status": 200,
	"message": "School class updated successfully",
	"data": {
		"id": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"schoolId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"homeroomTeacherId": "edd59c34-2ce6-4c18-afbd-5a820674ead7",
		"name": "4D"
	}
}
```

---

DELETE `/api/v1/school-classes/:id` - usuwa klasę szkolną o danym `id` i nic nie zwraca.
Zwracany status w przypadku powodzenia: `204`
