import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-sisterhood.jpg";
import coachingImage from "@/assets/coaching-session.jpg";

const blogPosts = [
  {
    id: 1,
    title: "5 Morning Rituals to Start Your Day with Intention",
    excerpt: "Discover how small morning practices can transform your entire day and set the tone for success and inner peace.",
    category: "Wellness",
    date: "January 5, 2026",
    readTime: "5 min read",
    image: heroImage,
  },
  {
    id: 2,
    title: "The Power of Female Friendships in Adulthood",
    excerpt: "Why nurturing sisterhood bonds becomes more important as we navigate careers, motherhood, and personal growth.",
    category: "Sisterhood",
    date: "December 28, 2025",
    readTime: "7 min read",
    image: coachingImage,
  },
  {
    id: 3,
    title: "Setting Boundaries: A Guide for the Recovering People-Pleaser",
    excerpt: "Learn practical strategies to establish healthy boundaries without guilt and reclaim your energy.",
    category: "Empowerment",
    date: "December 20, 2025",
    readTime: "8 min read",
    image: heroImage,
  },
  {
    id: 4,
    title: "Finding Your Voice: Speaking Up in Male-Dominated Spaces",
    excerpt: "Strategies and mindset shifts for women who want to be heard and respected in professional settings.",
    category: "Career",
    date: "December 15, 2025",
    readTime: "6 min read",
    image: coachingImage,
  },
  {
    id: 5,
    title: "Self-Care Beyond the Bubble Bath: Deep Rest for Modern Women",
    excerpt: "Exploring meaningful self-care practices that address the root of burnout and restore your whole being.",
    category: "Wellness",
    date: "December 10, 2025",
    readTime: "10 min read",
    image: heroImage,
  },
  {
    id: 6,
    title: "Embracing Your Authentic Self in a World of Comparison",
    excerpt: "How to stay true to yourself in the age of social media and find peace in your unique journey.",
    category: "Mindset",
    date: "December 5, 2025",
    readTime: "6 min read",
    image: coachingImage,
  },
];

const categories = ["All", "Wellness", "Sisterhood", "Empowerment", "Career", "Mindset"];

const Blog = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-soft">
        <div className="container-custom mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-blush text-primary rounded-full text-sm font-medium mb-6">
              Insights & Inspiration
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-6">
              The <span className="text-primary italic">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stories, strategies, and wisdom for the modern woman on her journey 
              of growth, wellness, and empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 bg-blush text-primary text-xs font-medium rounded-full mb-4 w-fit">
                  Featured
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {blogPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <Button variant="default" className="w-fit">
                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* All Posts */}
      <section className="section-padding pt-0">
        <div className="container-custom mx-auto">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden group">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-blush/30">
        <div className="container-custom mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Never Miss a Post
            </h2>
            <p className="text-muted-foreground mb-10">
              Subscribe to our newsletter and receive weekly insights, tips, and 
              exclusive content delivered straight to your inbox.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/#newsletter">Subscribe Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
