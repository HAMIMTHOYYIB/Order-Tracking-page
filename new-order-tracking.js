const proField = document.getElementById("processText");
      const data1 = document.getElementById("data-1");
      const data2 = document.getElementById("data-2");

      document
        .getElementById("trackForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          proField.textContent = "_ _ _";
          proField.style.color = "grey";
          const phoneNo = document.getElementById("phone").value;
          await checkValidation(phoneNo);
        });

      function checkValidation(phoneNo) {
        if (phoneNo == "") {
          proField.style.color = "red";
          proField.textContent = "Phone Number cannot be empty";
          return;
        }
        const phonePatt = /^[0-9]{10}$/;
        if (phonePatt.test(phoneNo)) {
          FetchOrderDetails(phoneNo);
        } else {
          proField.style.color = "red";
          proField.textContent = "Phone number must be exactly 10 digits";
        }
      }
      async function FetchOrderDetails(phone) {
        proField.innerHTML = ` <dotlottie-player src="https://lottie.host/26c3e5c4-453c-4c81-b10c-c000e6c1248f/tcxXZm35wH.lottie"  speed="1.2" style=" height:60px; margin:-16px auto;" loop autoplay></dotlottie-player> `;

        try {
          const response = await fetch(
            "https://order-tracking-3oer.onrender.com/tracking/get-tracking",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ consignee_phone: phone }),
            }
          );

          // Parse the response
          const data = await response.json();
          console.log("here data::", data);

          // Handle response data
          if (response.ok && data.trackingDetails.length > 0) {
            console.log(data);
            // Display orders

            // proField.innerHTML = `
            // <dotlottie-player
            //   src="https://lottie.host/dc1f1f4a-994f-417a-abd0-46e689e3d1b3/WQFxNZRikM.lottie"
            //   speed="5"
            //   style="height:300px; margin:-25px 0;"
            //   autoplay
            // ></dotlottie-player>
            // `;

            data1.classList.add("hidden");
            data2.classList.remove("hidden");
            const orderDetails = data.trackingDetails[0].order; // Get the first order
            const productDetails = orderDetails.product_details; // Get the product details
            const createdAt = new Date(
              orderDetails.createdAt
            ).toLocaleDateString(); // Format the 'createdAt' date

            data2.innerHTML = `
        <div class="w-full md:h-screen md:mt-20">
          <div class="w-full">
            <ul class="flex flex-col md:flex-row w-full justify-around bg-gray-50 p-5 border rounded-lg">
              <li class="font-semibold text-gray-700">
                Ordered On: <span class="text-gray-500">${createdAt}</span>
              </li>
              <li class="font-semibold text-gray-700">
                Consignee Name: <span class="text-gray-500">${
                  orderDetails.consignee_name
                }</span>
              </li>
              <li class="font-semibold text-gray-700">
                Phone No: <span class="text-gray-500">${
                  orderDetails.phoneNumber
                }</span>
              </li>
              <li class="font-semibold text-gray-700">
                Courier: <span class="text-gray-500">${
                  orderDetails.courier_service
                }</span>
              </li>
            </ul>

            <div class="bg-gray-50 w-full my-2 rounded-lg p-5">
              <h1 class="font-bold text-gray-700 text-xl mb-2">Items</h1>
              <div id="productArea" class="w-full flex flex-wrap justify-around gap-y-2 max-h-40 overflow-y-scroll">
                ${productDetails
                  .map(
                    (product) => `
                    <div id="prodCard" class="border-2 rounded p-2 w-4/5 md:w-2/5 text-center font-semibold text-gray-700 relative">
                      <p>${product.name}</p><br>
                      <div class="text-lg font-bold font-mono absolute bottom-0 w-full flex justify-between pe-4">
                        <span class="ms-2">₹${product.unit_price}</span>
                        <span class="me-2">×${product.quantity}</span>
                      </div>
                    </div>
                  `
                  )
                  .join("")}
              </div>
            </div>

            <div id="trackArea" class="bg-gray-50 w-full rounded-lg p-5">
              <div class="flex justify-between">
                <p class="text-gray-700 font-semibold">Updated On: <span class="text-gray-500">Mon, Dec 27</span></p>
                <p class="text-gray-400 font-mono font-bold hover:text-gray-600 cursor-pointer hover:underline duration-300">#${
                  data.trackingDetails[0].trackingData.refrence_id
                }</p>
              </div>
            </div>
          </div>
        </div>
      `;
            // });
          } else {
            // proField.style.color = "red";
            proField.textContent = "No orders found for this phone number.";
          }
        } catch (error) {
          // Handle errors
          proField.style.color = "red";
          proField.textContent =
            "Failed to fetch order details. Please try again.";
          console.error("Error fetching order details:", error);
        }
      }
