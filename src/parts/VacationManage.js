import React, { useState, useEffect, useContext } from "react";
import api from "../Config/axiosconfig";
import AuthContext from '../context/AuthContext';

const typeOptions = ["Beach", "Historical", "Nature", "Mountain"];

export default function VacationManage() {
  const { auth } = useContext(AuthContext);
  const [vacations, setVacations] = useState([]);
  const [form, setForm] = useState({
    NamaTempat: "",
    Kota: "",
    Keterangan: "",
    type: "",
    popularity: 0,
    Img1: "",
    Img2: "",
    Img3: "",
    Img1File: null,
    Img2File: null,
    Img3File: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all vacations on component mount
  useEffect(() => {
    fetchVacations();
  }, []);

  const fetchVacations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/wisata");
      setVacations(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching vacations:", err);
      setError("Failed to load vacation data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm({
        ...form,
        [name + "File"]: files[0],
        [name]: URL.createObjectURL(files[0]),
      });
    }
  };

  const prepareFormData = () => {
    const formData = new FormData();
    // Make sure the field names match what the API expects
  formData.append("nama", form.NamaTempat); // Changed NamaTempat -> nama
  formData.append("kota", form.Kota); // Changed Kota -> kota
  formData.append("keterangan", form.Keterangan); // Changed Keterangan -> keterangan
  formData.append("type", form.type);
  formData.append("popularity", form.popularity || 0);
  
  // Add image files
  if (form.Img1File) formData.append("images", form.Img1File);
  if (form.Img2File) formData.append("images", form.Img2File);
  if (form.Img3File) formData.append("images", form.Img3File);
  
    return formData;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.NamaTempat || !form.Kota || !form.type || !form.Img1File) {
      setError("Required fields: Name, City, Type and at least one image");
      return;
    }

    try {
      setLoading(true);
      const formData = prepareFormData();

      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1] instanceof File ? pair[1].name : pair[1]);
      }

      const response = await api.post("/wisata", formData);
      console.log("API Response:", response.data);
      
      setSuccess("Vacation destination added successfully!");
      fetchVacations(); // Refresh the list
      
      // Reset form
      setForm({
        NamaTempat: "",
        Kota: "",
        Keterangan: "",
        type: "",
        popularity: 0,
        Img1: "",
        Img2: "",
        Img3: "",
        Img1File: null,
        Img2File: null,
        Img3File: null,
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error adding vacation:", err);
      setError("Failed to add vacation. " + (err.response?.data?.message || ""));
      if (err.response && err.response.data) {
        console.error("Server response:", err.response.data);
      }
          setError("Failed to add vacation. " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vac) => {
    setEditingId(vac.TujuanID || vac.id);
    setForm({
      NamaTempat: vac.NamaTempat,
      Kota: vac.Kota,
      Keterangan: vac.Keterangan || "",
      type: vac.type,
      popularity: vac.Popularity || 0,
      Img1: vac.ImgUrl || "",
      Img2: vac.Url_1 || "",
      Img3: vac.Url_2 || "",
      Img1File: null,
      Img2File: null,
      Img3File: null,
      imageId: vac.ImageID || null,
    });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  
  if (!form.NamaTempat || !form.Kota || !form.type) {
    setError("Name, City and Type are required fields");
    return;
  }

  try {
    setLoading(true);
    const formData = new FormData();
    
    // Add text fields
    formData.append("nama", form.NamaTempat);
    formData.append("kota", form.Kota);
    formData.append("keterangan", form.Keterangan || "");
    formData.append("type", form.type);
    formData.append("popularity", form.popularity || 0);
    
    // Add image ID if available
    if (form.imageId) {
      formData.append("imageId", form.imageId);
    }
    
    // Add flags for which images are being updated
    formData.append("updateImg1", form.Img1File ? "true" : "false");
    formData.append("updateImg2", form.Img2File ? "true" : "false");
    formData.append("updateImg3", form.Img3File ? "true" : "false");
    
    // Add image files
    if (form.Img1File) formData.append("images", form.Img1File);
    if (form.Img2File) formData.append("images", form.Img2File);
    if (form.Img3File) formData.append("images", form.Img3File);
    
    await api.put(`/wisata/${editingId}`, formData);
    
    setSuccess("Vacation destination updated successfully!");
    fetchVacations(); // Refresh the list
    
    // Reset form and editing state
    setEditingId(null);
    setForm({
      NamaTempat: "",
      Kota: "",
      Keterangan: "",
      type: "",
      popularity: 0,
      Img1: "",
      Img2: "",
      Img3: "",
      Img1File: null,
      Img2File: null,
      Img3File: null,
    });
    } catch (err) {
      console.error("Error updating vacation:", err);
      setError("Failed to update vacation. " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vacation destination?")) {
      try {
        setLoading(true);
        await api.delete(`/wisata/${id}`);
        
        setSuccess("Vacation destination deleted successfully!");
        setVacations(vacations.filter(vac => (vac.TujuanID || vac.id) !== id));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Error deleting vacation:", err);
        setError("Failed to delete vacation.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && vacations.length === 0) {
    return <div className="text-center my-5">Loading vacation data...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Vacation Management</h2>
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}
      
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
              required
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
              required
            />
          </div>
          <div className="col">
            <select
              name="type"
              className="form-control"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Type</option>
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="number"
              name="popularity"
              className="form-control"
              placeholder="Popularity (0-5)"
              value={form.popularity}
              onChange={handleChange}
              min="0"
              max="5"
            />
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
            <label className="form-label">Image 1 (Primary)</label>
            <input
              type="file"
              name="Img1"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.Img1 && (
              <img
                src={form.Img1.startsWith('blob:') ? form.Img1 : `http://localhost:3001${form.Img1}`}
                alt="Preview 1"
                style={{ height: 60, marginTop: 4 }}
              />
            )}
          </div>
          <div className="col">
            <label className="form-label">Image 2</label>
            <input
              type="file"
              name="Img2"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.Img2 && (
              <img
                src={form.Img2.startsWith('blob:') ? form.Img2 : `http://localhost:3001${form.Img2}`}
                alt="Preview 2"
                style={{ height: 60, marginTop: 4 }}
              />
            )}
          </div>
          <div className="col">
            <label className="form-label">Image 3</label>
            <input
              type="file"
              name="Img3"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {form.Img3 && (
              <img
                src={form.Img3.startsWith('blob:') ? form.Img3 : `http://localhost:3001${form.Img3}`}
                alt="Preview 3"
                style={{ height: 60, marginTop: 4 }}
              />
            )}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  {' '}
                  {editingId ? "Updating..." : "Adding..."}
                </span>
              ) : (
                editingId ? "Update" : "Add"
              )}
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
                    popularity: 0,
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
      
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Nama Tempat</th>
              <th>Kota</th>
              <th style={{ width: "100px" }}>Type</th>
              <th style={{ width: "100px" }}>Pop.</th>
              <th style={{ width: "80px" }}>Img 1</th>
              <th style={{ width: "80px" }}>Img 2</th>
              <th style={{ width: "80px" }}>Img 3</th>
              <th style={{ width: "120px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vacations.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  No vacation data available.
                </td>
              </tr>
            ) : (
              vacations.map((vac, idx) => (
                <tr key={vac.TujuanID || vac.id}>
                  <td>{idx + 1}</td>
                  <td>{vac.NamaTempat}</td>
                  <td>{vac.Kota}</td>
                  <td>{vac.type}</td>
                  <td>{vac.Popularity || 0}/5</td>
                  <td>
                    {vac.ImgUrl && (
                      <img 
                        src={`${vac.ImgUrl}`} 
                        alt="" 
                        style={{ width: 60, height: 40, objectFit: 'cover' }} 
                      />
                    )}
                  </td>
                  <td>
                    {vac.Url_1 && (
                      <img 
                        src={`${vac.Url_1}`} 
                        alt="" 
                        style={{ width: 60, height: 40, objectFit: 'cover' }} 
                      />
                    )}
                  </td>
                  <td>
                    {vac.Url_2 && (
                      <img 
                        src={`${vac.Url_2}`} 
                        alt="" 
                        style={{ width: 60, height: 40, objectFit: 'cover' }} 
                      />
                    )}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(vac)}
                        disabled={loading}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(vac.TujuanID || vac.id)}
                        disabled={loading}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}