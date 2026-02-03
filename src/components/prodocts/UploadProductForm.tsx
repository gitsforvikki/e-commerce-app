export const UploadProductForm = () => {
  return (
    <>
      <div>Upload Product Form</div>
      <form>
        <div>
          <label>Product Name:</label>
          <input type="text" name="productName" />
        </div>
        <div>
          <label>Product Description:</label>
          <input type="text" name="productDescription" />
        </div>
        <div>
          <label>Product Price:</label>
          <input type="number" name="productPrice" />
        </div>
        <div>
          <label>Product Image:</label>
          <input type="file" name="productImage" />
        </div>
        <div>
          <label>Product Category:</label>
          <select name="productCategory">
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="KIDS">Kids</option>
          </select>
        </div>
      </form>
    </>
  );
};
