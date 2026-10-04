import { useState } from "react";

function AttributeList() {
  const [attributes, setAttributes] =
    useState([
      {
        name: "Color",
        values: "Red, Blue, Black, White"
      },
      {
        name: "Size",
        values: "S, M, L, XL"
      },
      {
        name: "Storage",
        values: "64GB, 128GB, 256GB"
      }
    ]);

  const [name, setName] = useState("");
  const [values, setValues] = useState("");

  const addAttribute = (event) => {
    event.preventDefault();

    if (!name.trim() || !values.trim()) {
      return;
    }

    setAttributes([
      ...attributes,
      {
        name,
        values
      }
    ]);

    setName("");
    setValues("");
  };

  return (
    <>
      <div className="admin-page-title">
        <div>
          <h1>Attributes</h1>

          <p>
            Manage product attributes and values.
          </p>
        </div>
      </div>


      <div className="admin-two-columns">

        <div className="admin-card">

          <h3>Add Attribute</h3>

          <form onSubmit={addAttribute}>

            <div className="form-group">

              <label>
                Attribute Name
              </label>

              <input
                value={name}
                placeholder="Example: Color"
                onChange={(event) =>
                  setName(event.target.value)
                }
              />

            </div>


            <div className="form-group">

              <label>
                Values
              </label>

              <input
                value={values}
                placeholder="Red, Blue, Black"
                onChange={(event) =>
                  setValues(event.target.value)
                }
              />

              <small>
                Separate values with commas.
              </small>

            </div>


            <button
              className="admin-primary-button"
            >
              Save Attribute
            </button>

          </form>

        </div>


        <div className="admin-card">

          <h3>Attribute List</h3>

          <table className="admin-table">

            <thead>
              <tr>
                <th>Attribute</th>
                <th>Values</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {attributes.map(
                (attribute, index) => (

                  <tr key={index}>

                    <td>
                      <strong>
                        {attribute.name}
                      </strong>
                    </td>

                    <td>
                      {attribute.values}
                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          setAttributes(
                            attributes.filter(
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

export default AttributeList;