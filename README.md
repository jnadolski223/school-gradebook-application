# Projekt zespołowy
Temat projektu: Dziennik elektroniczny dla szkół
Członkowie grupy:
- Jakub Nadolski
- Igor Gula

## Opis projektu
Celem projektu jest stworzenie dziennika elektronicznego dla szkół podstawowych i średnich na wzór aplikacji tj. Librus.

## Technologie użyte w projekcie
- Frontend: TypeScript, React, Next.js
- Backend: Java, Spring Boot
- Baza danych: PostgreSQL
- Konteneryzacja aplikacji: Docker

## Role użytkowników
W aplikacji będzie dostępnie kilka ról użytkowników:
- Administrator aplikacji
- Administrator szkoły
- Nauczyciel
- Wychowawca
- Uczeń
- Rodzic

Schemat dziedziczenia funkcjonalności przypisanych do ról przedstawiono na [[Role użytkowników.canvas|diagramie]].

## Wymagania funkcjonalne aplikacji
Wymagania funkcjonalne zostały podzielone według ról użytkowników, które będą dostępne w systemie dziennika elektronicznego. Role **Użytkownik** i **Członek szkoły** są abstrakcyjnymi rolami, które nie są dostępne dla użytkowników aplikacji.

### Użytkownik
- Zarządzanie danymi konta

### Administrator aplikacji
- Funkcjonalności dla roli ***Użytkownik***
- Obsługa wniosków o rejestrację szkoły w systemie
- Zarządzanie szkołami w systemie

### Administrator szkoły
- Funkcjonalności dla roli ***Użytkownik*** 
- Zarządzanie danymi szkoły
- Zarządzanie klasami w szkole
- Zarządzanie planami zajęć klas i nauczycieli

### Członek szkoły
- Funkcjonalności dla roli ***Użytkownik***
- Przeglądanie planu zajęć
- Przeglądanie kalendarza
- Przeglądanie wiadomości
- Pisanie wiadomości

### Uczeń
- Funkcjonalności dla roli ***Członek szkoły****
- Przeglądanie ocen
- Przeglądanie frekwencji
- Przeglądanie uwag

### Rodzic
- Funkcjonalności dla roli ***Uczeń***
- Dostęp do listy uczniów, których jest się rodzicem

### Nauczyciel
- Funkcjonalności dla roli ***Członek szkoły***
- Przeglądanie i wpisywanie ocen (tylko dla uczniów uczonych klas)
- Przeglądanie i wpisywanie frekwencji (tylko dla uczniów uczonych klas)
- Przeglądanie i wpisywanie uwag (tylko dla uczniów uczonych klas)
- Wpisywanie wydarzeń do kalendarza

### Wychowawca
- Funkcjonalności dla roli ***Nauczyciel***
- Przeglądanie danych uczniów klasy
- Przeglądanie planu zajęć klasy
- Modyfikacja frekwencji uczniów klasy
