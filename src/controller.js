import { LibroValidador } from './libros.model';

class LibrosController {
  async getAll(req, res) {
    const [result] = await pool.query('SELECT * FROM libros');
    res.json(result);
  }

  async getOne(req, res) {
    const id_libro = req.params.id;
    const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id_libro]);

    if (result[0] !== undefined) {
      res.json(result);
    } else {
      res.json({ "Error": "Oh no, no se ha encontrado el ID del libro" });
    }
  }

  async add(req, res) {
    try {
      const libro = req.body;

      // Validamos que los atributos del libro sean válidos
      const validador = new LibroValidador();
      const errores = validador.validar(libro);
      if (errores) {
        return res.json({ "Errores": errores });
      }

      // Insertamos el libro en la base de datos
      const [result] = await pool.query('INSERT INTO libros(nombre, autor, categoria, aniosPublicacion, ISBN) VALUES (?, ?, ?, ?, ?)', [
        libro.nombre,
        libro.autor,
        libro.categoria,
        libro.aniosPublicacion,
        libro.ISBN,
      ]);

      res.json({ "Id insertado": result.insertId });
    } catch (error) {
      // Capturamos cualquier excepción y devolvemos una respuesta JSON con el error
      res.json({ "Error": error.message });
    }
  }

  async update(req, res) {
    try {
      const libro = req.body;

      // Validamos que los atributos del libro sean válidos
      const validador = new LibroValidador();
      const errores = validador.validar(libro);
      if (errores) {
        return res.json({ "Errores": errores });
      }

      // Actualizamos el libro en la base de datos
      const [result] = await pool.query(
        'UPDATE libros SET nombre = ?, autor = ?, categoria = ?, aniosPublicacion = ?, ISBN = ? WHERE id = ?',
        [
          libro.nombre,
          libro.autor,
          libro.categoria,
          libro.aniosPublicacion,
          libro.ISBN,
          libro.id,
        ]
      );

      res.json({ "Registros actualizados": result.changedRows });
    } catch (error) {
      // Capturamos cualquier excepción y devolvemos una respuesta JSON con el error
      res.json({ "Error": error.message });
    }
  }

  async delete(req, res) {
    try {
      const id_libro = req.params.id;

      // Eliminamos el libro de la base de datos
      const [result] = await pool.query('DELETE FROM libros WHERE id = ?', [id_libro]);

      res.json({ "Registros eliminados": result.affectedRows });
    } catch (error) {
      // Capturamos cualquier excepción y devolvemos una respuesta JSON con el error
      res.json({ "Error": error.message });
    }
  }
}

export const libro = new LibrosController();
