function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "");
}

const PESOS_DICCIONARIO = {
    "desayuno": { "Alimentación": 0.8, "Responsabilidades": 0.2 },
    "desayunar": { "Alimentación": 0.8 },
    "almuerzo": { "Alimentación": 0.8 },
    "almorzar": { "Alimentación": 0.8 },
    "comida": { "Alimentación": 0.9 },
    "comer": { "Alimentación": 0.9 },
    "cena": { "Alimentación": 0.8, "Sueño": 0.1 },
    "cenar": { "Alimentación": 0.8, "Sueño": 0.1 },
    "lonche": { "Alimentación": 0.8, "Responsabilidades": 0.2 },
    "merienda": { "Alimentación": 0.7 },
    "colacion": { "Alimentación": 0.5 },
    "snack": { "Alimentación": 0.4 },
    "refrigerio": { "Alimentación": 0.5 },

    "agua": { "Alimentación": 0.6, "Higiene": 0.1 },
    "jugo": { "Alimentación": 0.4 },
    "juguito": { "Alimentación": 0.4 },
    "leche": { "Alimentación": 0.5 },
    "lechita": { "Alimentación": 0.5 },
    "chocomilk": { "Alimentación": 0.5, "Ocio": 0.1 },
    "licuado": { "Alimentación": 0.6 },
    "malteada": { "Alimentación": 0.3, "Ocio": 0.2 },
    "refresco": { "Alimentación": 0.1, "Ocio": 0.1 },
    "soda": { "Alimentación": 0.1, "Ocio": 0.1 },
    "atole": { "Alimentación": 0.5 },

    "fruta": { "Alimentación": 0.7 },
    "verdura": { "Alimentación": 0.8 },
    "manzana": { "Alimentación": 0.6 },
    "platano": { "Alimentación": 0.6 },
    "uvas": { "Alimentación": 0.6 },
    "fresas": { "Alimentación": 0.6 },
    "zanahoria": { "Alimentación": 0.6 },
    "ensalada": { "Alimentación": 0.8 },
    "sopa": { "Alimentación": 0.7 },
    "caldo": { "Alimentación": 0.7 },
    "caldito": { "Alimentación": 0.7 },
    "pollo": { "Alimentación": 0.7 },
    "carne": { "Alimentación": 0.7 },
    "pescado": { "Alimentación": 0.8 },
    "huevo": { "Alimentación": 0.7 },
    "huevito": { "Alimentación": 0.7 },
    "frijoles": { "Alimentación": 0.7 },
    "arroz": { "Alimentación": 0.6 },
    "tortilla": { "Alimentación": 0.5 },
    "pan": { "Alimentación": 0.4 },

    "dulce": { "Alimentación": 0.1, "Ocio": 0.3 },
    "dulces": { "Alimentación": 0.1, "Ocio": 0.4 },
    "paleta": { "Alimentación": 0.1, "Ocio": 0.3 },
    "chocolate": { "Alimentación": 0.2, "Ocio": 0.3 },
    "galleta": { "Alimentación": 0.3, "Ocio": 0.2 },
    "galletas": { "Alimentación": 0.3, "Ocio": 0.2 },
    "helado": { "Alimentación": 0.2, "Ocio": 0.4 },
    "nieve": { "Alimentación": 0.2, "Ocio": 0.4 },
    "pastel": { "Alimentación": 0.2, "Ocio": 0.4, "Social": 0.2 },
    "papitas": { "Alimentación": 0.1, "Ocio": 0.3 },
    "sabritas": { "Alimentación": 0.1, "Ocio": 0.3 },
    "churritos": { "Alimentación": 0.1, "Ocio": 0.2 },
    "pizza": { "Alimentación": 0.4, "Ocio": 0.4, "Social": 0.2 },
    "hamburguesa": { "Alimentación": 0.4, "Ocio": 0.3 },
    "tacos": { "Alimentación": 0.5, "Social": 0.2 },
    "taquitos": { "Alimentación": 0.5 },
    "quesadilla": { "Alimentación": 0.6 },

    "dormir": { "Sueño": 1.0 },
    "dormirse": { "Sueño": 1.0 },
    "sueno": { "Sueño": 0.8 },
    "siesta": { "Sueño": 0.8 },
    "pestanita": { "Sueño": 0.6 },
    "acostar": { "Sueño": 0.8 },
    "acostarse": { "Sueño": 0.8 },
    "descansar": { "Sueño": 0.7, "Actividad Física": 0.1 },
    "despertar": { "Sueño": 0.3 },
    "levantar": { "Sueño": 0.3 },
    "cama": { "Sueño": 0.5, "Responsabilidades": 0.2 },
    "cobija": { "Sueño": 0.4 },
    "pijama": { "Sueño": 0.6, "Higiene": 0.2 },
    "almohada": { "Sueño": 0.4 },
    "bostezo": { "Sueño": 0.3 },
    "noche": { "Sueño": 0.4 },
    "madrugar": { "Sueño": 0.2, "Responsabilidades": 0.3 },

    "bano": { "Higiene": 0.9 },
    "banar": { "Higiene": 0.9 },
    "banarse": { "Higiene": 0.9 },
    "banito": { "Higiene": 0.9 },
    "regadera": { "Higiene": 0.8 },
    "tina": { "Higiene": 0.8, "Ocio": 0.3 },
    "ducha": { "Higiene": 0.9 },
    "lavar": { "Higiene": 0.7, "Responsabilidades": 0.4 },
    "lavarse": { "Higiene": 0.8 },
    "dientes": { "Higiene": 0.9, "Responsabilidades": 0.3 },
    "muelas": { "Higiene": 0.8 },
    "manos": { "Higiene": 0.7 },
    "cara": { "Higiene": 0.6 },
    "carita": { "Higiene": 0.6 },
    "cuerpo": { "Higiene": 0.6 },
    "pelo": { "Higiene": 0.6 },
    "cabello": { "Higiene": 0.6 },
    "unas": { "Higiene": 0.7 },
    "cepillar": { "Higiene": 0.8 },
    "peinar": { "Higiene": 0.7 },
    "jabon": { "Higiene": 0.5 },
    "shampoo": { "Higiene": 0.5 },
    "champu": { "Higiene": 0.5 },
    "crema": { "Higiene": 0.4 },
    "desodorante": { "Higiene": 0.5 },
    "gel": { "Higiene": 0.3 },
    "pipi": { "Higiene": 0.8 },
    "popo": { "Higiene": 0.8 },
    "caca": { "Higiene": 0.8 },
    "cambiar": { "Higiene": 0.4, "Responsabilidades": 0.2 },
    "ropa": { "Higiene": 0.3, "Responsabilidades": 0.3 },
    "calzones": { "Higiene": 0.5 },
    "chones": { "Higiene": 0.5 },
    "calcetines": { "Higiene": 0.3 },
    "uniforme": { "Higiene": 0.3, "Responsabilidades": 0.5, "Aprendizaje": 0.2 },

    "escuela": { "Aprendizaje": 0.8, "Social": 0.4 },
    "kinder": { "Aprendizaje": 0.8, "Social": 0.5, "Ocio": 0.3 },
    "preescolar": { "Aprendizaje": 0.8, "Social": 0.5 },
    "primaria": { "Aprendizaje": 0.8, "Social": 0.4 },
    "colegio": { "Aprendizaje": 0.8, "Social": 0.4 },
    "clase": { "Aprendizaje": 0.8 },
    "clases": { "Aprendizaje": 0.8 },
    "salon": { "Aprendizaje": 0.6, "Social": 0.3 },
    "tarea": { "Aprendizaje": 0.9, "Responsabilidades": 0.6 },
    "tareas": { "Aprendizaje": 0.9, "Responsabilidades": 0.6 },
    "deberes": { "Aprendizaje": 0.9, "Responsabilidades": 0.6 },
    "estudiar": { "Aprendizaje": 1.0, "Responsabilidades": 0.4 },
    "leer": { "Aprendizaje": 0.8, "Ocio": 0.3 },
    "lectura": { "Aprendizaje": 0.8 },
    "escribir": { "Aprendizaje": 0.8 },
    "repasar": { "Aprendizaje": 0.7 },
    "practicar": { "Aprendizaje": 0.6 },
    "sumar": { "Aprendizaje": 0.7 },
    "restar": { "Aprendizaje": 0.7 },
    "multiplicar": { "Aprendizaje": 0.8 },
    "investigar": { "Aprendizaje": 0.8 },
    "exponer": { "Aprendizaje": 0.7, "Social": 0.3 },
    "aprender": { "Aprendizaje": 0.9 },

    "matematicas": { "Aprendizaje": 0.9 },
    "mates": { "Aprendizaje": 0.9 },
    "espanol": { "Aprendizaje": 0.9 },
    "ciencias": { "Aprendizaje": 0.9 },
    "historia": { "Aprendizaje": 0.9 },
    "ingles": { "Aprendizaje": 0.9 },
    "computacion": { "Aprendizaje": 0.7, "Ocio": 0.2 },
    "libro": { "Aprendizaje": 0.7, "Ocio": 0.2 },
    "cuaderno": { "Aprendizaje": 0.7 },
    "libreta": { "Aprendizaje": 0.7 },
    "mochila": { "Aprendizaje": 0.4, "Responsabilidades": 0.5 },
    "lapiz": { "Aprendizaje": 0.4 },
    "colores": { "Aprendizaje": 0.3, "Ocio": 0.4 },
    "crayolas": { "Aprendizaje": 0.3, "Ocio": 0.4 },
    "plumones": { "Aprendizaje": 0.3, "Ocio": 0.3 },
    "borrador": { "Aprendizaje": 0.3 },
    "sacapuntas": { "Aprendizaje": 0.3 },
    "tijeras": { "Aprendizaje": 0.3, "Ocio": 0.2 },
    "resistol": { "Aprendizaje": 0.3, "Ocio": 0.2 },
    "examen": { "Aprendizaje": 0.9, "Responsabilidades": 0.3 },
    "calificacion": { "Aprendizaje": 0.6, "Responsabilidades": 0.4 },
    "maestro": { "Aprendizaje": 0.6, "Social": 0.2 },
    "maestra": { "Aprendizaje": 0.6, "Social": 0.2 },
    "profe": { "Aprendizaje": 0.6, "Social": 0.2 },
    "miss": { "Aprendizaje": 0.6, "Social": 0.2 },

    "ejercicio": { "Actividad Física": 0.9 },
    "entrenar": { "Actividad Física": 0.9, "Responsabilidades": 0.3 },
    "entrenamiento": { "Actividad Física": 0.9, "Responsabilidades": 0.3 },
    "calentar": { "Actividad Física": 0.5 },
    "estirar": { "Actividad Física": 0.5 },
    "sudar": { "Actividad Física": 0.7, "Higiene": -0.2 }, "correr": { "Actividad Física": 0.9 },
    "carreritas": { "Actividad Física": 0.9, "Ocio": 0.6, "Social": 0.5 },
    "caminar": { "Actividad Física": 0.5 },
    "paseo": { "Actividad Física": 0.4, "Ocio": 0.5, "Social": 0.4 },
    "saltar": { "Actividad Física": 0.8, "Ocio": 0.3 },
    "brincar": { "Actividad Física": 0.8, "Ocio": 0.3 },
    "rodar": { "Actividad Física": 0.6, "Ocio": 0.4 },
    "trepar": { "Actividad Física": 0.7, "Ocio": 0.4 },
    "escalar": { "Actividad Física": 0.8 },
    "maromas": { "Actividad Física": 0.7, "Ocio": 0.6 },

    "futbol": { "Actividad Física": 0.9, "Social": 0.6, "Ocio": 0.4 },
    "fut": { "Actividad Física": 0.9, "Social": 0.6, "Ocio": 0.4 },
    "cascarita": { "Actividad Física": 0.9, "Social": 0.8, "Ocio": 0.7 },
    "chutar": { "Actividad Física": 0.7, "Ocio": 0.4 },
    "gol": { "Actividad Física": 0.5, "Ocio": 0.5, "Social": 0.3 },
    "porteria": { "Actividad Física": 0.4 },
    "basquet": { "Actividad Física": 0.9, "Social": 0.5 },
    "basquetbol": { "Actividad Física": 0.9, "Social": 0.5 },
    "beisbol": { "Actividad Física": 0.8, "Social": 0.5 },
    "beis": { "Actividad Física": 0.8, "Social": 0.5 },
    "tenis": { "Actividad Física": 0.8, "Social": 0.3 },
    "natacion": { "Actividad Física": 0.9, "Higiene": 0.3 },
    "nadar": { "Actividad Física": 0.9, "Ocio": 0.5 },
    "clavados": { "Actividad Física": 0.8, "Ocio": 0.6 },
    "karate": { "Actividad Física": 0.8, "Responsabilidades": 0.3, "Aprendizaje": 0.2 },
    "taekwondo": { "Actividad Física": 0.8, "Responsabilidades": 0.3, "Aprendizaje": 0.2 },
    "tkd": { "Actividad Física": 0.8, "Responsabilidades": 0.3, "Aprendizaje": 0.2 },
    "judo": { "Actividad Física": 0.8, "Responsabilidades": 0.3 },
    "voleibol": { "Actividad Física": 0.8, "Social": 0.6 },
    "voli": { "Actividad Física": 0.8, "Social": 0.6 },
    "gimnasia": { "Actividad Física": 0.9, "Aprendizaje": 0.2 },
    "ballet": { "Actividad Física": 0.8, "Aprendizaje": 0.3, "Ocio": 0.2 },

    "bici": { "Actividad Física": 0.8, "Ocio": 0.6 },
    "bicicleta": { "Actividad Física": 0.8, "Ocio": 0.6 },
    "triciclo": { "Actividad Física": 0.6, "Ocio": 0.6 },
    "patines": { "Actividad Física": 0.8, "Ocio": 0.6 },
    "patinar": { "Actividad Física": 0.8, "Ocio": 0.6 },
    "patineta": { "Actividad Física": 0.8, "Ocio": 0.6 },
    "scooter": { "Actividad Física": 0.6, "Ocio": 0.6 },
    "diablito": { "Actividad Física": 0.5, "Ocio": 0.7 },
    "parque": { "Actividad Física": 0.6, "Ocio": 0.8, "Social": 0.5 },
    "cancha": { "Actividad Física": 0.8, "Social": 0.5 },
    "alberca": { "Actividad Física": 0.7, "Ocio": 0.8, "Social": 0.5, "Higiene": 0.2 },
    "piscina": { "Actividad Física": 0.7, "Ocio": 0.8, "Social": 0.5, "Higiene": 0.2 },
    "patio": { "Actividad Física": 0.5, "Ocio": 0.5 },
    "jardin": { "Actividad Física": 0.4, "Ocio": 0.5 },
    "deportiva": { "Actividad Física": 0.8, "Social": 0.4 },

    "jugar": { "Ocio": 0.9, "Social": 0.3 },
    "juego": { "Ocio": 0.8 },
    "jueguito": { "Ocio": 0.8 },
    "juguetes": { "Ocio": 0.8 },
    "carrito": { "Ocio": 0.7 },
    "carritos": { "Ocio": 0.7 },
    "muneca": { "Ocio": 0.7 },
    "munecas": { "Ocio": 0.7 },
    "barbies": { "Ocio": 0.7 },
    "peluche": { "Ocio": 0.6, "Sueño": 0.2 },
    "lego": { "Ocio": 0.8, "Aprendizaje": 0.4 },
    "legos": { "Ocio": 0.8, "Aprendizaje": 0.4 },
    "bloques": { "Ocio": 0.8, "Aprendizaje": 0.4 },
    "rompecabezas": { "Ocio": 0.7, "Aprendizaje": 0.6 },
    "plastilina": { "Ocio": 0.7, "Aprendizaje": 0.3 },
    "masita": { "Ocio": 0.7, "Aprendizaje": 0.3 },
    "slime": { "Ocio": 0.8 },
    "canicas": { "Ocio": 0.7, "Social": 0.3 },
    "trompo": { "Ocio": 0.7, "Actividad Física": 0.2 },
    "yoyo": { "Ocio": 0.6 },
    "burbujas": { "Ocio": 0.7 },

    "escondidillas": { "Ocio": 0.9, "Actividad Física": 0.7, "Social": 0.8 },
    "escondidas": { "Ocio": 0.9, "Actividad Física": 0.7, "Social": 0.8 },
    "traes": { "Ocio": 0.8, "Actividad Física": 0.9, "Social": 0.8 }, "congelados": { "Ocio": 0.8, "Actividad Física": 0.8, "Social": 0.8 },
    "stop": { "Ocio": 0.7, "Actividad Física": 0.6, "Social": 0.8, "Aprendizaje": 0.2 },
    "avioncito": { "Ocio": 0.8, "Actividad Física": 0.6, "Aprendizaje": 0.2 },
    "rayuela": { "Ocio": 0.7, "Actividad Física": 0.4 },
    "loteria": { "Ocio": 0.7, "Social": 0.7, "Aprendizaje": 0.3 },
    "memorama": { "Ocio": 0.7, "Aprendizaje": 0.6, "Social": 0.4 },
    "dados": { "Ocio": 0.6, "Aprendizaje": 0.3 },
    "cartas": { "Ocio": 0.6, "Social": 0.5 },
    "uno": { "Ocio": 0.8, "Social": 0.8 },
    "tele": { "Ocio": 0.7 },
    "television": { "Ocio": 0.7 },
    "caricaturas": { "Ocio": 0.8 },
    "dibujos": { "Ocio": 0.7 },
    "pelicula": { "Ocio": 0.8, "Social": 0.3 },
    "peliculas": { "Ocio": 0.8, "Social": 0.3 },
    "cine": { "Ocio": 0.9, "Social": 0.5 },
    "palomitas": { "Ocio": 0.4, "Alimentación": 0.3 },
    "youtube": { "Ocio": 0.8 },
    "netflix": { "Ocio": 0.8 },
    "disney": { "Ocio": 0.8 },
    "tablet": { "Ocio": 0.8 },
    "ipad": { "Ocio": 0.8 },
    "celular": { "Ocio": 0.8 },
    "cel": { "Ocio": 0.8 },
    "compu": { "Ocio": 0.7, "Aprendizaje": 0.2 },
    "computadora": { "Ocio": 0.7, "Aprendizaje": 0.2 },

    "videojuego": { "Ocio": 0.9, "Social": 0.2 },
    "videojuegos": { "Ocio": 0.9, "Social": 0.2 },
    "nintendo": { "Ocio": 0.9 },
    "switch": { "Ocio": 0.9 },
    "xbox": { "Ocio": 0.9 },
    "play": { "Ocio": 0.9 },
    "playstation": { "Ocio": 0.9 },
    "roblox": { "Ocio": 0.9, "Social": 0.4, "Aprendizaje": 0.2 }, "minecraft": { "Ocio": 0.9, "Social": 0.4, "Aprendizaje": 0.4 }, "fortnite": { "Ocio": 0.9, "Social": 0.6 },
    "mario": { "Ocio": 0.9 },
    "free fire": { "Ocio": 0.9, "Social": 0.5 },
    "toca boca": { "Ocio": 0.9, "Aprendizaje": 0.2 },
    "brawl stars": { "Ocio": 0.9, "Social": 0.5 },
    "pkxd": { "Ocio": 0.9, "Social": 0.4 },
    "fifa": { "Ocio": 0.9, "Social": 0.5 },

    "dibujar": { "Ocio": 0.8, "Aprendizaje": 0.4 },
    "pintar": { "Ocio": 0.8, "Aprendizaje": 0.4 },
    "colorear": { "Ocio": 0.8, "Aprendizaje": 0.3 },
    "manualidad": { "Ocio": 0.8, "Aprendizaje": 0.5 },
    "manualidades": { "Ocio": 0.8, "Aprendizaje": 0.5 },
    "recortar": { "Ocio": 0.6, "Aprendizaje": 0.4 },
    "pegar": { "Ocio": 0.5, "Aprendizaje": 0.2 },
    "musica": { "Ocio": 0.7, "Aprendizaje": 0.4 },
    "bailar": { "Ocio": 0.8, "Actividad Física": 0.7, "Social": 0.3 },
    "baile": { "Ocio": 0.8, "Actividad Física": 0.7 },
    "cantar": { "Ocio": 0.7, "Aprendizaje": 0.2, "Social": 0.2 },
    "cancion": { "Ocio": 0.6, "Aprendizaje": 0.2 },
    "disfraz": { "Ocio": 0.9, "Social": 0.3 },
    "disfrazarse": { "Ocio": 0.9, "Social": 0.3 },
    "magia": { "Ocio": 0.8, "Aprendizaje": 0.3 },
    "chiste": { "Ocio": 0.6, "Social": 0.5 },
    "chistes": { "Ocio": 0.6, "Social": 0.5 },

    "recoger": { "Responsabilidades": 0.9 },
    "limpiar": { "Responsabilidades": 0.9 },
    "ordenar": { "Responsabilidades": 0.9 },
    "acomodar": { "Responsabilidades": 0.8 },
    "barrer": { "Responsabilidades": 0.9, "Actividad Física": 0.2 },
    "trapear": { "Responsabilidades": 0.9, "Actividad Física": 0.3 },
    "sacudir": { "Responsabilidades": 0.8 },
    "trapo": { "Responsabilidades": 0.5 },
    "escoba": { "Responsabilidades": 0.6 },
    "tender": { "Responsabilidades": 0.8 }, "platos": { "Responsabilidades": 0.8 }, "trastes": { "Responsabilidades": 0.9 }, "basura": { "Responsabilidades": 0.7 }, "polvo": { "Responsabilidades": 0.7 },
    "mesa": { "Responsabilidades": 0.6 }, "cuarto": { "Responsabilidades": 0.6 }, "habitacion": { "Responsabilidades": 0.6 },
    "recamara": { "Responsabilidades": 0.6 },

    "perro": { "Responsabilidades": 0.6, "Social": 0.4, "Ocio": 0.3 },
    "perrito": { "Responsabilidades": 0.6, "Social": 0.4, "Ocio": 0.4 },
    "gato": { "Responsabilidades": 0.5, "Social": 0.3 },
    "gatito": { "Responsabilidades": 0.5, "Social": 0.4 },
    "mascota": { "Responsabilidades": 0.7, "Social": 0.4 },
    "pasear": { "Responsabilidades": 0.7, "Actividad Física": 0.5, "Social": 0.3 },
    "alimentar": { "Responsabilidades": 0.8, "Social": 0.2 },
    "croquetas": { "Responsabilidades": 0.6 },

    "zapatos": { "Responsabilidades": 0.4, "Higiene": 0.2 },
    "bolear": { "Responsabilidades": 0.8, "Higiene": 0.3 }, "agujetas": { "Responsabilidades": 0.5, "Aprendizaje": 0.4 }, "guardar": { "Responsabilidades": 0.8 },
    "doblar": { "Responsabilidades": 0.8 }, "colgar": { "Responsabilidades": 0.7 },

    "ayudar": { "Responsabilidades": 0.9, "Social": 0.6 },
    "portarse": { "Responsabilidades": 0.7 }, "obedecer": { "Responsabilidades": 0.9 },
    "quehacer": { "Responsabilidades": 1.0, "Actividad Física": 0.2 },
    "reglas": { "Responsabilidades": 0.8, "Aprendizaje": 0.3 },

    "amigo": { "Social": 0.8, "Ocio": 0.2 },
    "amigos": { "Social": 0.9, "Ocio": 0.3 },
    "amiguitos": { "Social": 0.9, "Ocio": 0.3 },
    "compas": { "Social": 0.8 },
    "bff": { "Social": 0.9 },

    "familia": { "Social": 0.8 },
    "mama": { "Social": 0.7 },
    "mami": { "Social": 0.7 },
    "papa": { "Social": 0.7 },
    "papi": { "Social": 0.7 },
    "hermano": { "Social": 0.8, "Ocio": 0.2 },
    "hermana": { "Social": 0.8, "Ocio": 0.2 },
    "hermanos": { "Social": 0.8, "Ocio": 0.3 },
    "primo": { "Social": 0.8, "Ocio": 0.3 },
    "prima": { "Social": 0.8, "Ocio": 0.3 },
    "primos": { "Social": 0.9, "Ocio": 0.4 },
    "abuelo": { "Social": 0.7 },
    "abuela": { "Social": 0.7 },
    "abuelos": { "Social": 0.8 },
    "abuelito": { "Social": 0.8 },
    "abuelita": { "Social": 0.8 },
    "tito": { "Social": 0.7 }, "tita": { "Social": 0.7 }, "tio": { "Social": 0.6 },
    "tia": { "Social": 0.6 },
    "tios": { "Social": 0.7 },
    "padrino": { "Social": 0.6 },
    "madrina": { "Social": 0.6 },

    "fiesta": { "Social": 1.0, "Ocio": 0.8, "Alimentación": 0.3 },
    "pinata": { "Social": 0.9, "Ocio": 0.9, "Actividad Física": 0.5, "Alimentación": 0.3 },
    "cumpleanos": { "Social": 1.0, "Ocio": 0.8 },
    "cumple": { "Social": 1.0, "Ocio": 0.8 },
    "pinata": { "Social": 0.5, "Ocio": 0.5, "Alimentación": 0.3 }, "aguinaldo": { "Social": 0.5, "Ocio": 0.5, "Alimentación": 0.3 }, "reunion": { "Social": 0.8 },
    "visita": { "Social": 0.8 },
    "visitar": { "Social": 0.8 },
    "invitado": { "Social": 0.8 },
    "invitados": { "Social": 0.9 },
    "platicar": { "Social": 0.8, "Aprendizaje": 0.2 },
    "charlar": { "Social": 0.7 },
    "chismear": { "Social": 0.8, "Ocio": 0.3 },
    "hablar": { "Social": 0.6 },
    "compartir": { "Social": 0.9, "Responsabilidades": 0.5 },
    "prestar": { "Social": 0.8, "Responsabilidades": 0.5 },
    "abrazar": { "Social": 0.8, "Sueño": 0.1 }, "abrazo": { "Social": 0.8, "Sueño": 0.1 },
    "beso": { "Social": 0.7 },
    "reir": { "Social": 0.8, "Ocio": 0.4 },
    "sonrisa": { "Social": 0.6 },
    "convivencia": { "Social": 0.9 },
    "convivir": { "Social": 0.9 },
    "salir": { "Social": 0.6, "Ocio": 0.5 },
    "campamento": { "Social": 0.9, "Actividad Física": 0.7, "Ocio": 0.8, "Aprendizaje": 0.5 },
    "pijamada": { "Social": 1.0, "Ocio": 0.9, "Sueño": 0.2 }
};

const CATEGORIAS_DEFAULT = [
    "Alimentación", "Sueño", "Higiene", "Aprendizaje",
    "Actividad Física", "Ocio", "Responsabilidades", "Social"
];

function procesarActividad(texto) {
    const textoNormalizado = normalizarTexto(texto);
    const palabras = textoNormalizado.split(/\s+/);
    let resultado = {};
    CATEGORIAS_DEFAULT.forEach(cat => resultado[cat] = 0);

    palabras.forEach(palabra => {
        if (PESOS_DICCIONARIO[palabra]) {
            const impactos = PESOS_DICCIONARIO[palabra];

            for (const [categoria, peso] of Object.entries(impactos)) {
                if (resultado.hasOwnProperty(categoria)) {
                    resultado[categoria] += peso;
                }
            }
        }
    });

    for (let cat in resultado) {
        resultado[cat] = Math.min(1, Math.max(0, resultado[cat]));
        resultado[cat] = parseFloat(resultado[cat].toFixed(2));
    }

    return resultado;
}

// Del Select

const MAPEO_SELECT = {
    "alimentacion": "Alimentación",
    "sueño": "Sueño",
    "higiene": "Higiene",
    "aprendizaje": "Aprendizaje",
    "actividad_fisica": "Actividad Física",
    "ocio": "Ocio",
    "responsabilidades": "Responsabilidades",
    "social": "Social"
};


function categoriaSelect(valorSelect) {
    let resultado = {};
    CATEGORIAS_DEFAULT.forEach(cat => resultado[cat] = 0);
    const categoriaReal = MAPEO_SELECT[valorSelect];
    if (categoriaReal && resultado.hasOwnProperty(categoriaReal)) {
        resultado[categoriaReal] = 1;
    }
    return resultado;
}

// EMOJIS

// --- DICCIONARIO DE PESOS POR EMOJI ---
const PESOS_EMOJIS = {
    // 🥞 ALIMENTACIÓN - Desayunos y Bebidas
    "🍳": { "Alimentación": 0.8, "Responsabilidades": 0.1 }, // Huevo
    "🥞": { "Alimentación": 0.7, "Ocio": 0.2 }, // Hotcakes/Panqueques
    "🥓": { "Alimentación": 0.6, "Ocio": 0.2 }, // Tocino
    "🥣": { "Alimentación": 0.8 }, // Cereal / Avena
    "🍞": { "Alimentación": 0.6 }, // Pan de caja
    "🥐": { "Alimentación": 0.6, "Ocio": 0.1 }, // Cuernito / Croissant
    "🥪": { "Alimentación": 0.8, "Responsabilidades": 0.2 }, // Sándwich / Lonche
    "🥛": { "Alimentación": 0.5, "Sueño": 0.1 }, // Vaso de leche
    "🧃": { "Alimentación": 0.4 }, // Juguito en cajita
    "💧": { "Alimentación": 0.6, "Higiene": 0.1 }, // Agua
    "☕": { "Alimentación": 0.4 }, // Bebida caliente (chocolate/atole)

    // 🍎 ALIMENTACIÓN - Frutas y Verduras
    "🍎": { "Alimentación": 0.8, "Higiene": 0.2 }, // Manzana (saludable, lavar)
    "🍌": { "Alimentación": 0.7 }, // Plátano
    "🍉": { "Alimentación": 0.7 }, // Sandía
    "🍇": { "Alimentación": 0.7 }, // Uvas
    "🍓": { "Alimentación": 0.7 }, // Fresa
    "🍒": { "Alimentación": 0.7 }, // Cerezas
    "🥭": { "Alimentación": 0.8 }, // Mango
    "🥕": { "Alimentación": 0.8, "Higiene": 0.1 }, // Zanahoria
    "🥦": { "Alimentación": 0.9 }, // Brócoli
    "🥑": { "Alimentación": 0.8 }, // Aguacate
    "🥗": { "Alimentación": 0.9 }, // Ensalada

    // 🌮 ALIMENTACIÓN - Comida Fuerte / Antojos
    "🌮": { "Alimentación": 0.8, "Social": 0.2 }, // Tacos
    "🌯": { "Alimentación": 0.8 }, // Burrito
    "🍗": { "Alimentación": 0.8 }, // Pollo
    "🥩": { "Alimentación": 0.8 }, // Carne
    "🍝": { "Alimentación": 0.8 }, // Pasta / Espagueti
    "🍲": { "Alimentación": 0.8 }, // Sopa / Caldito
    "🍙": { "Alimentación": 0.7 }, // Arroz
    "🍣": { "Alimentación": 0.7, "Ocio": 0.2 }, // Sushi
    "🍕": { "Alimentación": 0.5, "Ocio": 0.4, "Social": 0.3 }, // Pizza
    "🍔": { "Alimentación": 0.5, "Ocio": 0.4 }, // Hamburguesa
    "🌭": { "Alimentación": 0.4, "Ocio": 0.4 }, // Hot dog

    // 🍦 ALIMENTACIÓN - Postres y Snacks
    "🍿": { "Alimentación": 0.2, "Ocio": 0.6 }, // Palomitas
    "🍦": { "Alimentación": 0.2, "Ocio": 0.5 }, // Helado / Nieve
    "🍩": { "Alimentación": 0.2, "Ocio": 0.4 }, // Dona
    "🍪": { "Alimentación": 0.3, "Ocio": 0.3 }, // Galleta
    "🍬": { "Alimentación": 0.1, "Ocio": 0.4 }, // Dulce
    "🍫": { "Alimentación": 0.2, "Ocio": 0.3 }, // Chocolate

    // 💤 SUEÑO Y DESCANSO
    "🛌": { "Sueño": 1.0 }, // Cama
    "🌙": { "Sueño": 0.9 }, // Luna / Noche
    "💤": { "Sueño": 0.8 }, // Dormir
    "🥱": { "Sueño": 0.6 }, // Bostezo
    "🧸": { "Sueño": 0.5, "Ocio": 0.4 }, // Peluche (relaja para dormir)
    "🌌": { "Sueño": 0.7 }, // Cielo estrellado / Noche

    // 🧼 HIGIENE Y AUTOCUIDADO
    "🛁": { "Higiene": 0.9, "Ocio": 0.3 }, // Bañera
    "🚿": { "Higiene": 0.9 }, // Regadera
    "🪥": { "Higiene": 0.9, "Responsabilidades": 0.2 }, // Cepillo de dientes
    "🧼": { "Higiene": 0.8, "Responsabilidades": 0.2 }, // Jabón
    "🚽": { "Higiene": 0.8 }, // Baño / Retrete
    "🧻": { "Higiene": 0.8 }, // Papel higiénico
    "🧴": { "Higiene": 0.7 }, // Crema / Shampoo
    "💇": { "Higiene": 0.7, "Responsabilidades": 0.1 }, // Corte de pelo / Peinarse
    "💅": { "Higiene": 0.5, "Ocio": 0.3 }, // Cortar uñas / Pintar uñas

    // 📚 APRENDIZAJE Y ESCUELA
    "📚": { "Aprendizaje": 0.9 }, // Libros
    "📖": { "Aprendizaje": 0.8, "Ocio": 0.2 }, // Leer
    "🎒": { "Aprendizaje": 0.7, "Responsabilidades": 0.4 }, // Mochila
    "✏️": { "Aprendizaje": 0.8 }, // Lápiz / Escribir
    "📝": { "Aprendizaje": 0.9, "Responsabilidades": 0.4 }, // Tarea / Examen
    "📏": { "Aprendizaje": 0.7 }, // Regla / Mates
    "🏫": { "Aprendizaje": 0.8, "Social": 0.4 }, // Escuela
    "🔬": { "Aprendizaje": 0.9, "Ocio": 0.2 }, // Ciencia / Experimentos
    "🌍": { "Aprendizaje": 0.8 }, // Geografía / Mundo
    "💻": { "Aprendizaje": 0.6, "Ocio": 0.3 }, // Computadora / Clases virtuales
    "🎨": { "Aprendizaje": 0.4, "Ocio": 0.8 }, // Arte / Pintar
    "🎸": { "Aprendizaje": 0.6, "Ocio": 0.5 }, // Clase de guitarra
    "🎹": { "Aprendizaje": 0.6, "Ocio": 0.5 }, // Clase de piano

    // ⚽ ACTIVIDAD FÍSICA Y DEPORTES
    "🏃": { "Actividad Física": 0.9 }, // Correr
    "⚽": { "Actividad Física": 0.9, "Social": 0.6, "Ocio": 0.5 }, // Futbol
    "🏀": { "Actividad Física": 0.9, "Social": 0.5 }, // Basquetbol
    "⚾": { "Actividad Física": 0.8, "Social": 0.5 }, // Beisbol
    "🏐": { "Actividad Física": 0.8, "Social": 0.6 }, // Voleibol
    "🎾": { "Actividad Física": 0.8, "Social": 0.3 }, // Tenis
    "🚴": { "Actividad Física": 0.8, "Ocio": 0.6 }, // Bicicleta
    "🏊": { "Actividad Física": 0.9, "Higiene": 0.2 }, // Nadar (limpia un poco)
    "🤸": { "Actividad Física": 0.8, "Ocio": 0.5 }, // Gimnasia / Maromas
    "🥋": { "Actividad Física": 0.8, "Responsabilidades": 0.3, "Aprendizaje": 0.2 }, // Karate / Taekwondo
    "🛹": { "Actividad Física": 0.8, "Ocio": 0.6 }, // Patineta
    "🛼": { "Actividad Física": 0.8, "Ocio": 0.6 }, // Patines
    "💃": { "Actividad Física": 0.7, "Ocio": 0.6, "Social": 0.3 }, // Bailar
    "🧗": { "Actividad Física": 0.8, "Ocio": 0.3 }, // Escalar / Trepar

    // 🎮 OCIO Y DIVERSIÓN
    "🎮": { "Ocio": 0.9, "Social": 0.3 }, // Videojuegos
    "🧩": { "Ocio": 0.7, "Aprendizaje": 0.5 }, // Rompecabezas / Legos
    "🚗": { "Ocio": 0.8 }, // Carritos de juguete
    "🪀": { "Ocio": 0.7, "Actividad Física": 0.2 }, // Yoyo / Trompo
    "🪁": { "Ocio": 0.8, "Actividad Física": 0.4 }, // Volar papalote / cometa
    "📺": { "Ocio": 0.8 }, // Ver tele / Caricaturas
    "📱": { "Ocio": 0.8 }, // Celular / Tablet
    "🎬": { "Ocio": 0.8, "Social": 0.4 }, // Ir al cine / Películas
    "🎧": { "Ocio": 0.7 }, // Escuchar música

    // 🧹 RESPONSABILIDADES Y HOGAR
    "🧹": { "Responsabilidades": 0.9, "Actividad Física": 0.2 }, // Barrer
    "🧽": { "Responsabilidades": 0.8, "Higiene": 0.2 }, // Lavar platos / Limpiar
    "🧺": { "Responsabilidades": 0.8 }, // Doblar ropa / Ropa sucia
    "👕": { "Responsabilidades": 0.6, "Higiene": 0.3 }, // Vestirse / Uniforme
    "🗑️": { "Responsabilidades": 0.8 }, // Tirar la basura
    "🪴": { "Responsabilidades": 0.7, "Aprendizaje": 0.2 }, // Regar plantas
    "🛒": { "Responsabilidades": 0.7, "Social": 0.3 }, // Acompañar al súper
    "🐕": { "Responsabilidades": 0.7, "Actividad Física": 0.5, "Social": 0.4 }, // Pasear al perro
    "🦴": { "Responsabilidades": 0.8, "Social": 0.2 }, // Dar de comer a mascota
    "🐈": { "Responsabilidades": 0.6, "Social": 0.4 }, // Cuidar gatito

    // 🫂 SOCIAL Y FAMILIA
    "👨‍👩‍👧‍👦": { "Social": 0.9 }, // Familia / Convivir
    "🫂": { "Social": 0.9, "Sueño": 0.1 }, // Abrazos
    "🤝": { "Social": 0.8, "Responsabilidades": 0.2 }, // Hacer las paces / Trato
    "🗣️": { "Social": 0.8, "Aprendizaje": 0.2 }, // Platicar / Chismear
    "🎉": { "Social": 0.9, "Ocio": 0.8 }, // Fiesta / Piñata
    "🎂": { "Social": 0.9, "Ocio": 0.7, "Alimentación": 0.4 }, // Cumpleaños / Pastel
    "🙌": { "Social": 0.8, "Ocio": 0.3 }, // Celebrar / Chocar las manos

    // ⭐ EXTRAS / COMODINES
    "⭐": { "Ocio": 0.2, "Responsabilidades": 0.2 }, // Comodín por defecto
    "🏆": { "Responsabilidades": 0.5, "Aprendizaje": 0.5, "Ocio": 0.5 }, // Premio / Logro
    "🩹": { "Higiene": 0.5, "Social": 0.3 }, // Poner curita / Médico
    "🦷": { "Higiene": 0.7, "Responsabilidades": 0.4 } // Ir al dentista / Ratón de los dientes
};


// --- FUNCION PARA CALCULAR EL PESO DEL EMOJI ---
function categoriaEmoji(emojiSeleccionado) {
    let resultado = {};
    CATEGORIAS_DEFAULT.forEach(cat => resultado[cat] = 0);

    if (PESOS_EMOJIS[emojiSeleccionado]) {
        const impactos = PESOS_EMOJIS[emojiSeleccionado];
        for (const [categoria, peso] of Object.entries(impactos)) {
            if (resultado.hasOwnProperty(categoria)) {
                resultado[categoria] = peso;
            }
        }
    }

    return resultado;
}

function promediarPesos(pesosIA, pesosSelect, pesosEmoji) {
    let resultadoFinal = {};

    CATEGORIAS_DEFAULT.forEach(cat => {
        let valIA = pesosIA[cat] || 0;
        let valSelect = pesosSelect[cat] || 0;
        let valEmoji = pesosEmoji[cat] || 0;
        let promedio = (valIA + valSelect + valEmoji) / 3;
        resultadoFinal[cat] = parseFloat(promedio.toFixed(2));
    });

    return resultadoFinal;
}