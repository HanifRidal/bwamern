import React, { useState } from "react";

const typeOptions = ["Beach", "Historical", "Nature", "Mountain"];

export default function VacationManage() {
  const [vacations, setVacations] = useState([
    {
      id: 1,
      NamaTempat: "Pantai Kuta",
      Kota: "Bali",
      Keterangan: "Pantai terkenal di Bali.",
      type: "Beach",
      Img1: "",
      Img2: "",
      Img3: "",
    },
  ]);
  const [form, setForm] = useState({
    NamaTempat: "",
    Kota: "",
    Keterangan: "",
    type: "",
    Img1: "",
    Img2: "",
    Img3: "",
    Img1File: null,
    Img2File: null,
    Img3File: null,
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm({
        ...form,
        [name]: URL.createObjectURL(files[0]),
        [name + "File"]: files[0],
      });
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.NamaTempat || !form.Kota || !form.Keterangan || !form.type)
      return;
    setVacations([
      ...vacations,
      {
        id: Date.now(),
        NamaTempat: form.NamaTempat,
        Kota: form.Kota,
        Keterangan: form.Keterangan,
        type: form.type,
        Img1: form.Img1,
        Img2: form.Img2,
        Img3: form.Img3,
      },
    ]);
    setForm({
      NamaTempat: "",
      Kota: "",
      Keterangan: "",
      type: "",
      Img1: "",
      Img2: "",
      Img3: "",
      Img1File: null,
      Img2File: null,
      Img3File: null,
    });
  };

  const handleEdit = (vac) => {
    setEditingId(vac.id);
    setForm({
      ...vac,
      Img1File: null,
      Img2File: null,
      Img3File: null,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setVacations(
      vacations.map((vac) =>
        vac.id === editingId
          ? {
              ...vac,
              NamaTempat: form.NamaTempat,
              Kota: form.Kota,
              Keterangan: form.Keterangan,
              type: form.type,
              Img1: form.Img1,
              Img2: form.Img2,
              Img3: form.Img3,
            }
          : vac
      )
    );
    setEditingId(null);
    setForm({
      NamaTempat: "",
      Kota: "",
      Keterangan: "",
      type: "",
      Img1: "",
      Img2: "",
      Img3: "",
      Img1File: null,
      Img2File: null,
      Img3File: null,
    });
  };

  const handleDelete = (id) => {
    setVacations(vacations.filter((vac) => vac.id !== id));
  };

  return (
    <div>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-4">
        <div className="row g-2">
          <div className="col">
            <input
              type="text"
              name="NamaTempat"
              className="form-control"
              placeholder="Nama Tempat"
              value={form.NamaTempat}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="Kota"
              className="form-control"
              placeholder="Kota"
              value={form.Kota}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <select
              name="type"
              className="form-control"
              value={form.type}
              onChange={handleChange}
            >
              <option value="">Pilih Type</option>
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col">
            <textarea
              name="Keterangan"
              className="form-control"
              placeholder="Keterangan"
              value={form.Keterangan}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col">
            <input
              type="file"
              name="Img1"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.Img1 && (
              <img
                src={form.Img1}
                alt="Preview 1"
                style={{ width: 40, marginTop: 4 }}
              />
            )}
          </div>
          <div className="col">
            <input
              type="file"
              name="Img2"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.Img2 && (
              <img
                src={form.Img2}
                alt="Preview 2"
                style={{ width: 40, marginTop: 4 }}
              />
            )}
          </div>
          <div className="col">
            <input
              type="file"
              name="Img3"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.Img3 && (
              <img
                src={form.Img3}
                alt="Preview 3"
                style={{ width: 40, marginTop: 4 }}
              />
            )}
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    NamaTempat: "",
                    Kota: "",
                    Keterangan: "",
                    type: "",
                    Img1: "",
                    Img2: "",
                    Img3: "",
                    Img1File: null,
                    Img2File: null,
                    Img3File: null,
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama Tempat</th>
            <th>Kota</th>
            <th>Keterangan</th>
            <th>Type</th>
            <th>Img 1</th>
            <th>Img 2</th>
            <th>Img 3</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vacations.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">
                No vacation data.
              </td>
            </tr>
          ) : (
            vacations.map((vac, idx) => (
              <tr key={vac.id}>
                <td>{idx + 1}</td>
                <td>{vac.NamaTempat}</td>
                <td>{vac.Kota}</td>
                <td>{vac.Keterangan}</td>
                <td>{vac.type}</td>
                <td>
                  {vac.Img1 && (
                    <img src={vac.Img1} alt="" style={{ width: 40 }} />
                  )}
                </td>
                <td>
                  {vac.Img2 && (
                    <img src={vac.Img2} alt="" style={{ width: 40 }} />
                  )}
                </td>
                <td>
                  {vac.Img3 && (
                    <img src={vac.Img3} alt="" style={{ width: 40 }} />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(vac)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(vac.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
