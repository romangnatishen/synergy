<template>
  <CCard>
    <CCardHeader>
      Invoice <strong>#90-98792</strong>
      <div class="float-right">
        <a href="#" class="btn btn-sm btn-info">
          <CIcon name="cil-save" /> Save
        </a>
        <a
          href="#"
          class="btn btn-sm btn-info ml-1"
          onclick="javascript:window.print();"
        >
          <CIcon name="cil-print" class="mr-1" /> Print
        </a>
      </div>
    </CCardHeader>
    <CCardBody>
      <CRow class="mb-4">
        <CCol sm="4">
          <h6 class="mb-3">From:</h6>
          <div><strong>BootstrapMaster.com</strong></div>
          <div>Konopnickiej 42</div>
          <div>43-190 Mikolow, Poland</div>
          <div>Email: lukasz@bootstrapmaster.com</div>
          <div>Phone: +48 123 456 789</div>
        </CCol>
        <CCol sm="4">
          <h6 class="mb-3">To:</h6>
          <div><strong>BootstrapMaster.com</strong></div>
          <div>Konopnickiej 42</div>
          <div>43-190 Mikolow, Poland</div>
          <div>Email: lukasz@bootstrapmaster.com</div>
          <div>Phone: +48 123 456 789</div>
        </CCol>
        <CCol sm="4">
          <h6 class="mb-3">Details:</h6>
          <div>Invoice <strong>#90-98792</strong></div>
          <div>March 30, 2013</div>
          <div>VAT: PL9877281777</div>
          <div>Account Name: BootstrapMaster.com</div>
          <div><strong>SWIFT code: 99 8888 7777 6666 5555</strong></div>
        </CCol>
      </CRow>
      <div class="table-responsive-sm">
        <table class="table table-striped">
          <thead>
            <tr>
              <th class="center">#</th>
              <th>Item</th>
              <th>Description</th>
              <th class="center">Quantity</th>
              <th class="right">Unit Cost</th>
              <th class="right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="center">1</td>
              <td class="left">Origin License</td>
              <td class="left">Extended License</td>
              <td class="center">1</td>
              <td class="right">$999,00</td>
              <td class="right">$999,00</td>
            </tr>
            <tr>
              <td class="center">2</td>
              <td class="left">Custom Services</td>
              <td class="left">
                Instalation and Customization (cost per hour)
              </td>
              <td class="center">20</td>
              <td class="right">$150,00</td>
              <td class="right">$3.000,00</td>
            </tr>
            <tr>
              <td class="center">3</td>
              <td class="left">Hosting</td>
              <td class="left">1 year subcription</td>
              <td class="center">1</td>
              <td class="right">$499,00</td>
              <td class="right">$499,00</td>
            </tr>
            <tr>
              <td class="center">4</td>
              <td class="left">Platinum Support</td>
              <td class="left">1 year subcription 24/7</td>
              <td class="center">1</td>
              <td class="right">$3.999,00</td>
              <td class="right">$3.999,00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CRow>
        <CCol lg="4" sm="5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </CCol>
        <CCol lg="4" sm="5" class="ml-auto">
          <table class="table table-clear">
            <tbody>
              <tr>
                <td class="left"><strong>Subtotal</strong></td>
                <td class="right">$8.497,00</td>
              </tr>
              <tr>
                <td class="left"><strong>Discount (20%)</strong></td>
                <td class="right">$1,699,40</td>
              </tr>
              <tr>
                <td class="left"><strong>VAT (10%)</strong></td>
                <td class="right">$679,76</td>
              </tr>
              <tr>
                <td class="left"><strong>Total</strong></td>
                <td class="right"><strong>$7.477,36</strong></td>
              </tr>
            </tbody>
          </table>
          <a href="#" class="btn btn-success">
            <CIcon name="cil-dollar" /> Proceed to Payment
          </a>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>
<script>
export default {
  name: 'Invoice',
};
</script>
