<template>
    <div class="max-w-2xl">
        <h1 class="text-center">Organigrama de Tseyor</h1>

        <section class="my-5 flex flex-wrap justify-evenly">
            <PLink to="/ong" :icon="$store.getters.getIconRoute('/ong')" class="btn my-4">ONG Mundo Armónico Tseyor</PLink>
            <PLink to="/universidad" :icon="$store.getters.getIconRoute('/universidad')"  class="btn my-4">Universidad Tseyor de Granada</PLink>
            <PLink to="/asociacion" :icon="$store.getters.getIconRoute('/asociacion')"  class="btn my-4">Tseyor Centro de Estudios</PLink>
        </section>

        <Card class="p-5 w-full items-center">
<blockquote>
        <p>
        Creo que es bueno hacer una reflexión de tipo general, a modo de inventario y balance de situación del colectivo Tseyor, con toda su estructura, con esas tres ramas principales con las que se adorna y pasea por el mundo.
        </p><p>                                                            Esas tres ramas, todos sabréis que son las conformadas por Tseyor Centro de Estudios Socioculturales, la Universidad Tseyor de Granada y la ONG Mundo Armónico Tseyor. Lo digo por si alguno no lo sabe o se le ha olvidado. Tres elementos indispensables en toda organización que se precie de altruismo y de ayuda humanitaria.
             </p>
      </blockquote>
      <p>Noiwanak, 861</p>
</Card>

<Card class="p-5 my-7">
<h2 class="text-center">Estructura interna de Tseyor</h2>
    <li>Ágora del Junantal</li>
     <li>Consejo de los Doce</li>
     <li>Comisión de Tseyor</li>
     <li>Junta de Priores</li>
     <li>...</li>
</Card>
    </div>
</template>