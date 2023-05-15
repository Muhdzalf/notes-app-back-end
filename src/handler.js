const { nanoid } = require('nanoid');
const notes = require('./notes');

// client akan menerima title, tag, body
const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id)[0];

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);

  // menerapkan CORS Cross Origin Resource Sharing (cara via header)
  // response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');

  return response;
};

// mendapatkan seluruh data dari notes
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

// get data by ID
const getNotesByIdHandler = (request, h) => {
  // mendapatkan parameter id
  const { id } = request.params;

  // filter array berdasarkan id
  const note = notes.filter((n) => n.id === id)[0];

  // cek bahwa note ada bukan undefinied
  if (note !== undefined) {
    return {
      status: 'Berhasil',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'Gagal',
    message: 'Catatan tidak ditemukan!',
  });

  response.code(404);
  return response;
};

// Upadate note Handler
const updateNotesByIdHandler = (request, h) => {
  const { id } = request.params;
  const updatedAt = new Date().toISOString();

  const { title, tags, body } = request.payload;

  // find index notes
  const index = notes.findIndex((n) => n.id === id);

  // berhasil merubah data
  if (index !== -1) {
    // memperbarui data notes
    notes[index] = {
      // menggunakan spread operator untuk menggubah data data
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'Berhasil',
      message: 'Data berhasil diperbaharui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'Gagal',
    message: 'Gagal memperbaharui catatan. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Delete Note Handler
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((n) => n.id === id);

  if (index !== id) {
    notes.splice(index, 1);

    const response = h.response({
      status: 'berhasil',
      message: 'notes berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'Gagal',
    message: 'Gagal menghapus catatan. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNotesByIdHandler,
  updateNotesByIdHandler,
  deleteNoteByIdHandler,
};
