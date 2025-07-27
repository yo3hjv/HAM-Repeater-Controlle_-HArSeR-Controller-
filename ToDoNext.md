# HArSeR Repeater Controller - ToDoNext



    1 - Batch files upload into SPIFFS.
    2 - Fully implement language files definitions
    3 - LCD >>> Icons for various operating states.



Bună ziua.
Nu am reușit să descarc fișierele imediat. Automatizarea descărcării cu o singură mișcare (fișier executabil) ar fi la mare căutare pentru un utilizator fără experiență ca mine.

Prin interfață:
1. Plasați butonul de pornire/oprire a repetorului în partea de sus a paginii principale;

2. Plasați butonul de activare a beaconului în partea de sus a paginii principale;

3. Eliminați afișajul constant al IP-ului de pe LCD, înlocuiți-l cu inscripția WiFi după conectarea la rețea;

4. Afișați puterea RSSI pe LCD (sub formă de bară mobilă sau valoare digitală (1000 - 3000);

5. Afișați starea repetorului pe LCD cu simboluri RX/TX.
6. Suplimentați circuitul electric cu posibilitatea de a asculta RX și TX direct de la repetor, fără a utiliza un post de radio.

R:

La punctul 1 si 2: Headerul (partea de sus a ecranului) si Footerul (partea de jos a ecranului) 
sunt fixe pe ecranul browserului. 
Acestea sunt afisate indiferent de continutul din mijlocul paginii. 
Logica realizarii interfetei cu utilizatorul in acest mod a fost ca in partea de sus, in Header, 
sa fie afisate informatii importante, usor de vizualizat iar in partea de jos, 
mai dificil de apasat accidental, comenzi. De aceea cred ca blocarea repetorului (USER LOCK) 
poate fi in partea de jos, langa butonul "Send Beacon", fiind astfel prezent indiferent de  
3: IP-ul este prezent pe afisaj pana la prima intrare in emisie pentru a permite administratorului 
sa vada clar ce IP a fost atribuit controllerului. 
4. Nu este posibil, m-am gandit si eu la asta si am vrut sa implementez functia insa informatia 
de pe LCD se actualizeaza pe zone, cu cea mai mica perioada de actualizare de cca 200 milisecunde, 
facand inutila afisarea unui RSSI. Pe pagina web este actualizata valoarea in timp real. 
5. Se poate face. 
6. Pentru a asculta traficul repetorului, adica statia portabila/mobila ce acceseaza repetorul,
poate fi folosit difuzorul statiei de receptie sau un mic amplificator conectat in paralel cu 
intrarea de semnal audio in controller. Daca solicitarea avea in vedere transmiterea fluxului audio 
prin internet, din pacate aceasta facilitate nu poate fi implementata cu un ESP32. 
