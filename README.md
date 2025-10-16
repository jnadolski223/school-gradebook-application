# Projekt zespołowy
**Temat projektu**: Dziennik elektroniczny dla szkół  
**Członkowie grupy**:
- Jakub Nadolski
- Igor Gula

## Opis projektu
Celem projektu jest stworzenie **dziennika elektronicznego** dla szkół podstawowych i szkół średnich na wzór aplikacji takich jak Librus lub eduVulkan.

## Narzędzia i technologie, które będą użyte w projekcie
- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, TypeScript
- **Główna baza danych**: PostgreSQL
- **Baza danych do przechowywanie sesji użytkowników**: Redis
- **Konteneryzacja aplikacji**: Docker / Kubernetes
- **Testowanie kodu aplikacji**: Jest

## Role użytkowników
- Administrator aplikacji
- Administrator szkoły
- Wychowawca klasy
- Nauczyciel
- Uczeń

## Uprawnienia dla roli **Administratora aplikacji**
- Sprawdzanie listy wszystkich utworzonych szkół w aplikacji
- Tworzenie i usuwanie szkół
- Tworzenie kont dla administratorów szkół
- Sprawdzanie wniosków od szkół o utworzenie szkoły w aplikacji
- Sprawdzanie zgłoszeń o błędach

## Uprawnienia dla roli **Administratora szkoły**
- Modyfikowanie informacji o swojej szkole
- Tworzenie, modyfikowanie i usuwanie kont członków należących do swojej szkoły
- Resetowanie haseł kont członków należących do swojej szkoły
- Przypisywanie ról członkom należącym do swojej szkoły
- Tworzenie, modyfikowanie oraz usuwanie klas w swojej szkole
- Przypisywanie członków swojej szkoły do klas
- Tworzenie, modyfikowanie i usuwanie planów zajęć
- Sprawdzanie oraz pisanie wiadomości i ogłoszeń
- Sprawdzanie oraz wpisywanie wydarzeń do kalendarza
- Zgłaszanie błędów do administratora aplikacji
- Zmiana loginu i hasła do konta

## Uprawnienia dla roli **Wychowawcy klasy**
- **To samo co rola nauczyciela**
- Sprawdzanie ocen, frekwencji na zajęciach i uwag uczniów swojej klasy
- Sprawdzanie planu zajęć swojej klasy
- Usprawiedliwianie nieobecności uczniów

## Uprawnienia dla roli **Nauczyciela**
- Wpisywanie ocen uczniom klas, z którymi ma zajęcia
- Wpisywanie obecności uczniów na zajęciach
- Sprawdzanie swojego planu zajęć
- Sprawdzanie oraz pisanie wiadomości i ogłoszeń
- Sprawdzanie oraz wpisywanie wydarzeń do kalendarza
- Pisanie uwag dla uczniów
- Zmiana loginu i hasła do konta

## Uprawnienia dla roli **Ucznia**
- Sprawdzanie swoich ocen, frekwencji na zajęciach i otrzymanych uwag
- Sprawdzanie planu zajęć
- Sprawdzanie kalendarza i wydarzeń w nim zawartych
- Sprawdzanie otrzymanych ogłoszeń i wiadomości
- Pisanie wiadomości
- Zmiana loginu i hasła do konta