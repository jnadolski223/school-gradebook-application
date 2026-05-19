# Dziennik elektroniczny

## Opis projektu
Celem projektu jest stworzenie dziennika elektronicznego dla szkół podstawowych i średnich na wzór aplikacji tj. Librus.

## Technologie użyte w projekcie
- Frontend: TypeScript, React, Next.js
- Backend: Java, Spring Boot
- Baza danych: PostgreSQL

## Role użytkowników
W aplikacji dostępne są następujące role użytkowników:
- Administrator aplikacji
- Administrator szkoły
- Nauczyciel
- Wychowawca
- Uczeń
- Rodzic

## Wymagania funkcjonalne aplikacji
Wymagania funkcjonalne zostały podzielone według ról użytkowników, które będą dostępne w systemie dziennika elektronicznego.
Role **Użytkownik** i **Członek szkoły** są abstrakcyjnymi rolami, które nie są dostępne dla użytkowników aplikacji.

### Niezalogowany użytkownik
- [x] Pisanie wniosków o rejestrację szkoły w systemie
- [x] Logowanie się na konto

### Użytkownik
- [x] Zarządzanie danymi konta

### Administrator aplikacji
- Funkcjonalności dla roli ***Użytkownik***
- [x] Obsługa wniosków o rejestrację szkoły w systemie
- [x] Zarządzanie szkołami w systemie

### Administrator szkoły
- Funkcjonalności dla roli ***Użytkownik*** 
- [x] Zarządzanie danymi szkoły
- [x] Zarządzanie członkami szkoły
- [x] Zarządzanie klasami w szkole
- [x] Zarządzanie planami zajęć klas i nauczycieli

### Członek szkoły
- Funkcjonalności dla roli ***Użytkownik***
- [x] Przeglądanie planu zajęć
- [ ] Przeglądanie kalendarza
- [ ] Przeglądanie wiadomości
- [ ] Pisanie wiadomości

### Uczeń
- Funkcjonalności dla roli ***Członek szkoły****
- [x] Przeglądanie ocen
- [x] Przeglądanie frekwencji
- [ ] Przeglądanie uwag

### Rodzic
- Funkcjonalności dla roli ***Uczeń***
- [x] Dostęp do listy uczniów, których jest się rodzicem

### Nauczyciel
- Funkcjonalności dla roli ***Członek szkoły***
- [x] Przeglądanie i wpisywanie ocen
- [x] Przeglądanie i wpisywanie frekwencji
- [ ] Przeglądanie i wpisywanie uwag
- [ ] Wpisywanie wydarzeń do kalendarza

### Wychowawca
- Funkcjonalności dla roli ***Nauczyciel***
- [ ] Przeglądanie danych uczniów klasy
- [ ] Przeglądanie planu zajęć klasy
- [ ] Modyfikacja frekwencji uczniów klasy
