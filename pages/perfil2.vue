<template>
  <section>
    <div>
      <h2>My Profile</h2>
      <div>
        <p>
          <strong>Username:</strong>
          {{ loggedInUser.username }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ loggedInUser.email }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  middleware: "logged",
  computed: {
    ...mapGetters(["loggedInUser"])
  }
};
</script>
