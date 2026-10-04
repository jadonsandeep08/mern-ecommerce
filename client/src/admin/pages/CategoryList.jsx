import { useState } from "react";

function CategoryList() {
  const [categories, setCategories] = useState([
    "Electronics",
    "Fashion",
    "Footwear",
    "Bags",
    "Home",
    "Furniture"
  ]);

  const [name, setName] = useState("");

  const addCategory = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setCategories([
      ...categories,
      name.trim()
    ]);

    setName("");
  };

  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>Categories</h1>
          <p>
            Manage product categories.
          </p>
        </div>
      </div>

      <div className="admin-two-columns">

        <div className="admin-card">

          <h3>Add Category</h3>

          <form onSubmit={addCategory}>

            <div className="form-group">

              <label>
                Category Name
              </label>

              <input
                type="text"
                value={name}
                placeholder="Example: Electronics"
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

            </div>

            <button
              className="admin-primary-button"
            >
              Save Category
            </button>

          </form>

        </div>


        <div className="admin-card">

          <h3>Category List</h3>

          <table className="admin-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {categories.map(
                (category, index) => (

                  <tr key={index}>

                    <td>{category}</td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() =>
                          setCategories(
                            categories.filter(
                              (_, i) =>
                                i !== index
                            )
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}

export default CategoryList;