import Footer from "./common/Footer";

function About() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
  ];

  const cards = [
    {
      icon: "👨‍💻",
      title: "Who Am I?",
      description:
        "I am a passionate learner interested in full-stack development and building modern web applications.",
    },
    {
      icon: "🎯",
      title: "My Goal",
      description:
        "My goal is to become a skilled developer and create useful applications that solve real-world problems.",
    },
    {
      icon: "✍️",
      title: "Why I Blog",
      description:
        "I share my programming knowledge, learning journey, project ideas, and experiences through my blog.",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl py-12 text-slate-800">
      <section className="mx-auto mb-16 max-w-3xl text-center">
        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold tracking-widest text-blue-700">
          ABOUT ME
        </span>

        <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">
          Hello, I'm <span className="text-blue-600">Ajay!</span>
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Welcome to my blog portfolio! I love technology,
          web development, and sharing knowledge. Here I share
          my ideas, experiences, and creative projects.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="text-5xl">{card.icon}</div>

            <h2 className="mt-5 text-2xl font-bold">
              {card.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="py-16 text-center">
        <h2 className="text-3xl font-extrabold">My Skills</h2>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-12 text-center text-white shadow-lg sm:px-12">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Let's Learn and Grow Together!
        </h2>

        <p className="mt-4 leading-7 text-blue-100">
          Thank you for visiting my blog portfolio.
          Keep learning, keep building, and stay curious!
        </p>

       
      </section>
          
          <hr></hr>
          <hr></hr>
          <hr></hr>
          <hr></hr>
          <hr></hr>
          <hr></hr>
       <Footer/>
      
    </main>
  );
}

export default About;
