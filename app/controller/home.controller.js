/**
 * @file Home controller for rendering main pages.
 * @module controller/home.controller
 */

/**
 * Renders the homepage.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getHomePage = (req, res) => {
    res.render('index', { 
        title: 'CRBC - Accueil',
        activePage: 'home'
    });
};

/**
 * Renders the about page.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getAboutPage = (req, res) => {
    res.render('about', { 
        title: 'À Propos - CRBC',
        activePage: 'about'
    });
};

/**
 * Renders the contact page.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getContactPage = (req, res) => {
    res.render('contact', { 
        title: 'Contact - CRBC',
        activePage: 'contact'
    });
};

/**
 * Renders the services page.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
export const getServicePage = (req, res) => {
    res.render('service', { 
        title: 'Services - CRBC',
        activePage: 'services'
    });
};
